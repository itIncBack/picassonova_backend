import {
  IsPasswordDecorator,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@infrastructure/decorators/validate/is-password.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { isEmail } from '@infrastructure/decorators/validate/is-email.decorator';

export class SignInInputDto {
  @ApiProperty({
    description: 'User email',
    example: 'example@gmail.com',
  })
  @isEmail()
  email: string;

  @ApiProperty({
    description:
      'Password: 0-9; A-Z; a-z;\n' +
      '! " # $ % & \' ( ) * + , - . / : ; < = > ?\n' +
      '@ [ \\ ] ^ _` { | } ~',
    example: 'rwrwerweQ3234',
    minLength: PASSWORD_MIN_LENGTH,
    maxLength: PASSWORD_MAX_LENGTH,
  })
  @IsPasswordDecorator()
  password: string;
}
