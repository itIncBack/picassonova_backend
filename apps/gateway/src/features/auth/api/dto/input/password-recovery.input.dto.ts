import { isEmail } from '@infrastructure/decorators/validate/is-email.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordRecoveryDto {
  @ApiProperty({
    description: 'User email',
    example: 'example@gmail.com',
    required: true,
  })
  @isEmail()
  email: string;

  @ApiProperty({
    description: 'Google Recaptcha token to validate the request',
    example: '03AGdBq27... (truncated for brevity)',
    required: true,
  })
  @Trim()
  @IsString({ message: 'Recaptcha token must be a string' })
  @IsNotEmpty({ message: 'Recaptcha token is required' })
  recaptcha_token: string;
}
