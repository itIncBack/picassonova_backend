import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '@apps/gateway/src/features/users/infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { SharedService } from '@infrastructure/servises/shared/shared.service';
import { ConfirmationRepository } from '@apps/gateway/src/features/users/infrastructure/confirmation.repository';
import { ConfirmationType } from '.prisma/client';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@settings/configuration';

export class SignUpCommand {
  constructor(
    public user_name: string,
    public password: string,
    public email: string,
  ) {}
}

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand, void> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly confirmationRepository: ConfirmationRepository,
    private readonly sharedService: SharedService,
    private readonly configService: ConfigService<ConfigurationType, true>,
  ) {}

  async execute(command: SignUpCommand): Promise<void> {
    const { user_name, password, email } = command;

    const user = await this.usersRepository.getUserByEmail(email);

    const apiSettings = this.configService.get('apiSettings', { infer: true });

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
}
