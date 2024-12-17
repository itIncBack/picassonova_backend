import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@settings/configuration';
import { UsersRepository } from '@apps/gateway/src/features/users/infrastructure/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected readonly usersQueryRepository: UsersRepository,
    private readonly configService: ConfigService<ConfigurationType, true>,
  ) {
    const apiSettings = configService.get('apiSettings', { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiSettings.JWT_SECRET_KEY,
      passReqToCallback: true, // Позволяет передать объект request в метод validate
    });
  }

  async validate(request: Request, payload: any) {
    const user = await this.usersQueryRepository.getUserById(payload.userId);

    return (request.currentUserId = user?.id);
  }
}
