import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@settings/configuration';
import { ConfirmationType } from '.prisma/client';
import { UsersRepository } from '@apps/gateway/src/features/users/infrastructure/users.repository';
import { SharedService } from '@infrastructure/servises/shared/shared.service';
import { ConfirmationRepository } from '@apps/gateway/src/features/users/infrastructure/confirmation.repository';
import { Request, Response } from 'express';
import { getUniqueId } from '@libs/utils/utils';
import { NewSessionDto } from '@apps/gateway/src/features/session/api/dto/new-session.dto';
import { COOKIE_KEY } from '@libs/utils/consts';
import { SignInOutputMapper } from '@apps/gateway/src/features/auth/api/dto/output/sign-in.output.dto';
import { SessionsRepository } from '@apps/gateway/src/features/session/infrastructure/sessions.repository';
import { CookieService } from '@infrastructure/servises/cookie/cookie.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
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

    const confirmationCode = await this.sharedService.generateConfirmationCode(
      email,
      {
        expiresIn: apiSettings.EMAIL_CONFIRMATION_CODE_EXPIRED_IN,
      },
    );

    const newUser = await this.usersRepository.createUser({
      user_name,
      hashedPassword,
      email,
    });

    await this.confirmationRepository.createConfirmation({
      user_id: newUser.id,
      code: confirmationCode,
      type: ConfirmationType.EMAIL_CONFIRMATION,
    });

    await this.sharedService.sendRegisterEmail(email, confirmationCode);
  }

  async signIn(email: string, password: string, res: Response, req: Request) {
    const user = await this.usersRepository.getUserByEmailWithPass(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isCorrectPass = await this.sharedService.validatePassword(
      password,
      user.password,
    );

    if (!isCorrectPass) {
      throw new UnauthorizedException();
    }

    const apiSettings = this.getApiSettings();

    const deviceId = getUniqueId();
    const userAgentHeader = req.headers['user-agent'] || 'unknown';
    const ipAddress = req.ip || 'unknown';

    const newSessionDto: NewSessionDto = {
      userId: user.id,
      ip: ipAddress,
      title: userAgentHeader,
      deviceId: deviceId,
    };

    const newSession = await this.sessionsRepository.create(newSessionDto);

    const newRefreshToken = await this.sharedService.getToken(
      user.id,
      deviceId,
      newSession.id,
      {
        expiresIn: apiSettings.REFRESH_TOKEN_EXPIRED_IN,
      },
    );

    const newAccessToken = await this.sharedService.getToken(
      user.id,
      deviceId,
      newSession.id,
      {
        expiresIn: apiSettings.ACCESS_TOKEN_EXPIRED_IN,
      },
    );

    this.cookieService.setCookie(
      res,
      COOKIE_KEY.REFRESH_TOKEN,
      newRefreshToken,
    );

    return SignInOutputMapper(newAccessToken);
  }
}
