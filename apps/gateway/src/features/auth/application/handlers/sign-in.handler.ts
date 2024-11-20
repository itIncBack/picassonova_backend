import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Response, Request } from 'express';
import {
  SignInOutputMapper,
  SignInOutputDto,
} from '@apps/gateway/src/features/auth/api/dto/output/sign-in.output.dto';
import { SharedService } from '@infrastructure/servises/shared/shared.service';
import { UsersRepository } from '@apps/gateway/src/features/users/infrastructure/users.repository';
import { UnauthorizedException } from '@nestjs/common';
import { getUniqueId } from '@libs/utils/utils';
import { ConfigurationType } from '@settings/configuration';
import { ConfigService } from '@nestjs/config';
import { CookieService } from '@infrastructure/servises/cookie/cookie.service';
import { COOKIE_KEY } from '@libs/utils/consts';
import { NewSessionDto } from '@apps/gateway/src/features/session/api/dto/new-session.dto';
import { SessionsRepository } from '@apps/gateway/src/features/session/infrastructure/sessions.repository';
import { InterlayerNotice } from '@libs/base/models/Interlayer';

export class SignInCommand {
  constructor(
    public email: string,
    public password: string,
    public res: Response,
    public req: Request,
  ) {}
}

@CommandHandler(SignInCommand)
export class SignInHandler
  implements ICommandHandler<SignInCommand, InterlayerNotice<SignInOutputDto>>
{
  constructor(
    private readonly sharedService: SharedService,
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService<ConfigurationType, true>,
    private readonly cookieService: CookieService,
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async execute(
    command: SignInCommand,
  ): Promise<InterlayerNotice<SignInOutputDto>> {
    const { email, password, res, req } = command;

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

    const apiSettings = this.configService.get('apiSettings', { infer: true });

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
