import { ApiProperty } from '@nestjs/swagger';
import { isEmail } from '@infrastructure/decorators/validate/is-email.decorator';

export class ResendVerificationEmailInputDto {
  @ApiProperty({
    description: 'User email',
    example: 'example@gmail.com',
    required: true,
  })
  @isEmail()
  email: string;
}
