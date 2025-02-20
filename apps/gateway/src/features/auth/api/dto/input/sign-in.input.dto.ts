import {
  IsPasswordDecorator,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@infrastructure/decorators/validate/is-password.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { isEmail } from '@infrastructure/decorators/validate/is-email.decorator';

export class SignInInputDto {
  @ApiProperty({
    description:
      'The email address of the user. This must be a valid email format.',
    example: 'example@gmail.com',
    required: true,
  })
  @isEmail()
  email: string;

  @ApiProperty({
    description: `User password. It must meet the following criteria:
      - Contains uppercase letters (A-Z)
      - Contains lowercase letters (a-z)
      - Contains numbers (0-9)
      - Contains at least one special character: ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ \` { | } ~`,
    example: 'StrongPassword123!',
    minLength: PASSWORD_MIN_LENGTH,
    maxLength: PASSWORD_MAX_LENGTH,
    required: true,
  })
  @IsPasswordDecorator()
  password: string;
}
