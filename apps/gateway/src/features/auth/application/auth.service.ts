import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@settings/configuration';
import { UsersRepository } from '@apps/gateway/src/features/users/infrastructure/users.repository';
import { SharedService } from '@infrastructure/servises/shared/shared.service';
import { ConfirmationRepository } from '@apps/gateway/src/features/users/infrastructure/confirmation.repository';
import { Request, Response } from 'express';
import { getUniqueId } from '@libs/utils/utils';
import { COOKIE_KEY } from '@libs/utils/consts';
import { SignInOutputMapper } from '@apps/gateway/src/features/auth/api/dto/output/sign-in.output.dto';
import { SessionsRepository } from '@apps/gateway/src/features/session/infrastructure/sessions.repository';
import { CookieService } from '@infrastructure/servises/cookie/cookie.service';
import { ReCaptchaService } from '@infrastructure/servises/re-captcha/re-captcha.service';
import { ConfirmationType } from '@prisma/client';
import { RefreshTokenOutputMapper } from '@apps/gateway/src/features/auth/api/dto/output/refresh-token.output.dto';
import { APISettings } from '@settings/api-settings';

@Injectable()
export class AuthService {
  private readonly apiSettings: APISettings;

  constructor(
    private readonly confirmationRepository: ConfirmationRepository,
    private readonly configService: ConfigService<ConfigurationType, true>,
    private readonly sharedService: SharedService,
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly cookieService: CookieService,
    private readonly recaptchaService: ReCaptchaService,
  ) {
    this.apiSettings = this.configService.get('apiSettings', { infer: true });
  }

  private async createSession(userId: string, req: Request) {
    const deviceId = getUniqueId();
    const userAgentHeader = req.headers['user-agent'] || 'unknown';
    const ipAddress = req.ip || 'unknown';

    return this.sessionsRepository.create({
      userId,
      ip: ipAddress,
      title: userAgentHeader,
      deviceId,
    });
  }

  private async generateTokens(
    userId: string,
    deviceId: string,
    sessionId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const apiSettings = this.apiSettings;

    const refreshToken = await this.sharedService.getToken(
      userId,
      deviceId,
      sessionId,
      {
        expiresIn: apiSettings.REFRESH_TOKEN_EXPIRED_IN,
      },
    );

    const accessToken = await this.sharedService.getToken(
      userId,
      deviceId,
      sessionId,
      {
        expiresIn: apiSettings.ACCESS_TOKEN_EXPIRED_IN,
      },
    );

    return { accessToken, refreshToken };
  }

  async signUp(userName: string, password: string, email: string) {
    const user = await this.usersRepository.getUserByEmail(email);

    if (user) {
      throw new BadRequestException({
        message: 'User already exists',
      });
    }

    const hashedPassword =
      await this.sharedService.generatePasswordHash(password);

    const newUser = await this.usersRepository.createUser({
      userName,
      hashedPassword,
      email,
    });

    const confirmationCode = await this.sharedService.generateConfirmationCode(
      newUser.id,
      {
        expiresIn: this.apiSettings.EMAIL_CONFIRMATION_CODE_EXPIRED_IN,
      },
    );

    await this.confirmationRepository.createConfirmation({
      userId: newUser.id,
      code: confirmationCode,
      type: ConfirmationType.EMAIL_VERIFICATION,
    });

    await this.sharedService.sendVerifyEmail(email, confirmationCode);
  }

  async signIn(email: string, password: string, res: Response, req: Request) {
    const user = await this.usersRepository.getUserByEmailWithPass(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const confirmation =
      await this.confirmationRepository.getConfirmationUserIdAndType(
        user.id,
        ConfirmationType.EMAIL_VERIFICATION,
      );

    if (!confirmation?.isConfirmed) {
      throw new UnauthorizedException();
    }

    const isCorrectPass = await this.sharedService.validatePassword(
      password,
      user.password,
    );

    if (!isCorrectPass) {
      throw new UnauthorizedException();
    }

    const refreshTokenFromRequest = this.cookieService.getCookie(
      req,
      COOKIE_KEY.REFRESH_TOKEN,
    );

    const verifiedToken = this.sharedService.verifyToken(
      refreshTokenFromRequest,
    );

    if (verifiedToken) {
      const { userId, deviceId, sessionId } = verifiedToken;

      const session = await this.sessionsRepository.getSessionByUserAndDevice(
        deviceId,
        userId,
      );

      if (session && userId === user.id) {
        const { accessToken, refreshToken } = await this.generateTokens(
          userId,
          deviceId,
          sessionId,
        );

        await this.sessionsRepository.update(session.id);

        this.cookieService.setCookie(
          res,
          COOKIE_KEY.REFRESH_TOKEN,
          refreshToken,
        );

        return SignInOutputMapper(accessToken);
      } else {
        const newSession = await this.createSession(user.id, req);

        const { accessToken, refreshToken } = await this.generateTokens(
          newSession.userId,
          newSession.deviceId,
          newSession.id,
        );

        this.cookieService.setCookie(
          res,
          COOKIE_KEY.REFRESH_TOKEN,
          refreshToken,
        );

        return SignInOutputMapper(accessToken);
      }
    }

    const newSession = await this.createSession(user.id, req);

    const { accessToken, refreshToken } = await this.generateTokens(
      newSession.userId,
      newSession.deviceId,
      newSession.id,
    );

    this.cookieService.setCookie(res, COOKIE_KEY.REFRESH_TOKEN, refreshToken);

    return SignInOutputMapper(accessToken);
  }

  async verifyEmail(code: string) {
    const verifiedToken = this.sharedService.verifyConfirmationCode(code);

    if (!verifiedToken) {
      throw new BadRequestException({
        message: 'Confirmation code expired',
        key: 'code',
      });
    }

    const confirmation =
      await this.confirmationRepository.getConfirmationByCode(code);

    if (!confirmation) {
      throw new BadRequestException({
        message: 'Activation code is not correct',
        key: 'code',
      });
    }

    if (confirmation.isConfirmed) {
      throw new BadRequestException({
        message: 'Email already confirmed',
        key: 'code',
      });
    }

    await this.confirmationRepository.updateIsConfirmed(confirmation.id, true);
  }

  async resendVerificationEmail(email: string) {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException({
        message: 'Email not found',
      });
    }

    const confirmation =
      await this.confirmationRepository.getConfirmationUserIdAndType(
        user.id,
        ConfirmationType.EMAIL_VERIFICATION,
      );

    if (!confirmation || confirmation?.isConfirmed) {
      throw new BadRequestException({
        message: 'Email already confirmed',
      });
    }

    const confirmationCode = await this.sharedService.generateConfirmationCode(
      user.id,
      {
        expiresIn: this.apiSettings.EMAIL_CONFIRMATION_CODE_EXPIRED_IN,
      },
    );

    await this.confirmationRepository.updateConfirmationCode(
      confirmation.id,
      confirmationCode,
    );

    await this.sharedService.sendVerifyEmail(email, confirmationCode);
  }

  async logout(req: Request, res: Response) {
    const refreshToken = this.cookieService.getCookie(
      req,
      COOKIE_KEY.REFRESH_TOKEN,
    );

    const verifiedToken = this.sharedService.verifyToken(refreshToken);

    if (!verifiedToken) {
      throw new UnauthorizedException();
    }

    await this.sessionsRepository.deleteSessionByUserAndDevice(
      verifiedToken.deviceId,
      verifiedToken.userId,
    );

    this.cookieService.clearCookie(res, COOKIE_KEY.REFRESH_TOKEN);
  }

  async passwordRecovery(email: string, recaptchaToken: string) {
    await this.recaptchaService.validate(recaptchaToken);

    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException({
        message: "User with this email doesn't exist",
        key: 'email',
      });
    }

    const confirmationCode = await this.sharedService.generateConfirmationCode(
      user.id,
      {
        expiresIn: this.apiSettings.EMAIL_CONFIRMATION_CODE_EXPIRED_IN,
      },
    );

    await this.confirmationRepository.upsertConfirmation({
      userId: user.id,
      code: confirmationCode,
      type: ConfirmationType.PASSWORD_RECOVERY,
    });

    await this.sharedService.sendRecoveryPassEmail(email, confirmationCode);
  }

  async newPassword(newPassword: string, recoveryCode: string) {
    const verifiedRecoveryCode =
      this.sharedService.verifyConfirmationCode(recoveryCode);

    if (!verifiedRecoveryCode || !verifiedRecoveryCode.userId) {
      throw new BadRequestException({
        message: 'RecoveryCode code expired',
        key: 'recoveryCode',
      });
    }

    const confirmation =
      await this.confirmationRepository.getConfirmationUserIdAndType(
        verifiedRecoveryCode.userId,
        ConfirmationType.PASSWORD_RECOVERY,
      );

    if (
      !confirmation ||
      confirmation.isConfirmed ||
      confirmation.code !== recoveryCode
    ) {
      throw new BadRequestException({
        message: 'Recovery code not correct',
        key: 'recoveryCode',
      });
    }

    await this.confirmationRepository.updateIsConfirmed(confirmation.id, true);

    const passwordHash =
      await this.sharedService.generatePasswordHash(newPassword);

    await this.usersRepository.updatePassword(
      confirmation.userId,
      passwordHash,
    );
  }

  async refreshTokens(req: Request, res: Response) {
    const refreshTokenFromRequest = this.cookieService.getCookie(
      req,
      COOKIE_KEY.REFRESH_TOKEN,
    );

    if (!refreshTokenFromRequest) {
      throw new UnauthorizedException();
    }

    const tokenPayload = this.sharedService.verifyToken(
      refreshTokenFromRequest,
    );

    if (!tokenPayload) {
      throw new UnauthorizedException();
    }

    const { userId, deviceId, sessionId } = tokenPayload;

    await this.sessionsRepository.update(sessionId);

    const { accessToken, refreshToken } = await this.generateTokens(
      userId,
      deviceId,
      sessionId,
    );

    this.cookieService.setCookie(res, COOKIE_KEY.REFRESH_TOKEN, refreshToken);

    return RefreshTokenOutputMapper(accessToken);
  }
}
