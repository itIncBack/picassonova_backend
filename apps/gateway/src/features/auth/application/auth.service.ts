import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@settings/configuration';
import { ConfirmationType } from '.prisma/client';
import { UsersRepository } from '@apps/gateway/src/features/users/infrastructure/users.repository';
import { SharedService } from '@infrastructure/servises/shared/shared.service';
import { ConfirmationRepository } from '@apps/gateway/src/features/users/infrastructure/confirmation.repository';
import { Request, Response } from 'express';
import { getUniqueId } from '@libs/utils/utils';
import { COOKIE_KEY } from '@libs/utils/consts';
import { SignInOutputMapper } from '@apps/gateway/src/features/auth/api/dto/output/sign-in.output.dto';
import { SessionsRepository } from '@apps/gateway/src/features/session/infrastructure/sessions.repository';
import { CookieService } from '@infrastructure/servises/cookie/cookie.service';
import { NewSession } from '@apps/gateway/src/features/session/infrastructure/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly confirmationRepository: ConfirmationRepository,
    private readonly configService: ConfigService<ConfigurationType, true>,
    private readonly sharedService: SharedService,
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly cookieService: CookieService,
  ) {}

  private getApiSettings() {
    return this.configService.get('apiSettings', { infer: true });
  }

  private async createSession(
    userId: string,
    req: Request,
  ): Promise<NewSession> {
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
    const apiSettings = this.getApiSettings();

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

  async signUp(user_name: string, password: string, email: string) {
    const user = await this.usersRepository.getUserByEmail(email);

    const apiSettings = this.getApiSettings();

    if (user) {
      throw new BadRequestException({
        message: 'User already exists',
      });
    }

    const hashedPassword =
      await this.sharedService.generatePasswordHash(password);

    const newUser = await this.usersRepository.createUser({
      user_name,
      hashedPassword,
      email,
    });

    const confirmationCode = await this.sharedService.generateConfirmationCode(
      newUser.id,
      {
        expiresIn: apiSettings.EMAIL_CONFIRMATION_CODE_EXPIRED_IN,
      },
    );

    await this.confirmationRepository.createConfirmation({
      email: email,
      code: confirmationCode,
      type: ConfirmationType.EMAIL_CONFIRMATION,
    });

    await this.sharedService.sendVerifyEmail(email, confirmationCode);
  }

  async signIn(email: string, password: string, res: Response, req: Request) {
    const user = await this.usersRepository.getUserByEmailWithPass(email);

    const confirmation =
      await this.confirmationRepository.getConfirmationByEmail(email);

    if (!user || !confirmation?.is_confirmed) {
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
      const { user_id, device_id, session_id } = verifiedToken;

      const session = await this.sessionsRepository.getSessionByUserAndDevice(
        device_id,
        user_id,
      );

      if (session && user_id === user.id) {
        const { accessToken, refreshToken } = await this.generateTokens(
          user_id,
          device_id,
          session_id,
        );

        await this.sessionsRepository.update(session.id);

        this.cookieService.setCookie(
          res,
          COOKIE_KEY.REFRESH_TOKEN,
          refreshToken,
        );

        return SignInOutputMapper(accessToken);
      } else {
        const deviceId = getUniqueId();

        const newSession = await this.createSession(user.id, req);

        const { accessToken, refreshToken } = await this.generateTokens(
          user.id,
          deviceId,
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

    const deviceId = getUniqueId();

    const newSession = await this.createSession(user.id, req);

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      deviceId,
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

    if (confirmation.is_confirmed) {
      throw new BadRequestException({
        message: 'Email already confirmed',
        key: 'code',
      });
    }

    await this.confirmationRepository.updateIsConfirmed(confirmation.id, true);
  }
}
