import { Trim } from '@infrastructure/decorators/transform/trim';
import {
  IsPasswordDecorator,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@infrastructure/decorators/validate/is-password.decorator';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewPasswordDto {
  @ApiProperty({
    description: `New password must contain a mix of the following:
      - Uppercase letters (A-Z)
      - Lowercase letters (a-z)
      - Numbers (0-9)
      - Special characters: ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ \` { | } ~`,
    example: 'StrongPassword123!',
    minLength: PASSWORD_MIN_LENGTH,
    maxLength: PASSWORD_MAX_LENGTH,
    required: true,
  })
  @IsPasswordDecorator()
  newPassword: string;

  @ApiProperty({
    description: 'Recovery code for resetting the password.',
    example: 'ABC123XYZ456',
    required: true,
  })
  @IsString({ message: 'RecoveryCode must be a string' })
  @Trim()
  @IsNotEmpty({ message: 'RecoveryCode is required' })
  recoveryCode: string;
}
