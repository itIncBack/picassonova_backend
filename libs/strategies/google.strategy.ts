import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@settings/configuration';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { EMPTY_PASS } from '@libs/utils/consts';
import { UsersRepository } from '@apps/gateway/src/features/users/infrastructure/users.repository';
import { ConfirmationType } from '@prisma/client';
import { SharedService } from '@infrastructure/servises/shared/shared.service';
import { ConfirmationRepository } from '@apps/gateway/src/features/users/infrastructure/confirmation.repository';
import { APISettings } from '@settings/api-settings';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  private readonly apiSettings: APISettings;
  constructor(
    private readonly configService: ConfigService<ConfigurationType, true>,
    private readonly confirmationRepository: ConfirmationRepository,
    private readonly sharedService: SharedService,
    protected readonly usersQueryRepository: UsersRepository,
  ) {
    const apiSettings = configService.get('apiSettings', { infer: true });

    super({
      clientID: apiSettings.GOOGLE_CLIENT_ID,
      clientSecret: apiSettings.GOOGLE_CLIENT_SECRET,
      callbackURL: apiSettings.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });

    this.apiSettings = this.configService.get('apiSettings', { infer: true });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const email = profile.emails?.[0].value;

    const user = await this.usersQueryRepository.getUserByEmail(email);

    if (!user) {
      const newUser = await this.usersQueryRepository.createUser({
        userName: profile.displayName,
        hashedPassword: EMPTY_PASS,
        email: email!,
      });

      const confirmationCode =
        await this.sharedService.generateConfirmationCode(newUser.id, {
          expiresIn: this.apiSettings.EMAIL_CONFIRMATION_CODE_EXPIRED_IN,
        });

      await this.confirmationRepository.createConfirmation({
        userId: newUser.id,
        code: confirmationCode,
        type: ConfirmationType.EMAIL_VERIFICATION,
        isConfirmed: true,
      });

      done(null, newUser);
    } else {
      done(null, user);
    }
  }
}
