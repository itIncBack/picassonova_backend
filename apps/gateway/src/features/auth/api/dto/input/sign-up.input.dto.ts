import { IsUserNameDecorator } from '@infrastructure/decorators/validate/is-user-name.decorator';
import { isEmail } from '@infrastructure/decorators/validate/is-email.decorator';
import { IsPasswordDecorator } from '@infrastructure/decorators/validate/is-password.decorator';

export class SignUpDto {
  @IsUserNameDecorator()
  user_name: string;

  @IsPasswordDecorator()
  password: string;

  @isEmail()
  email: string;
}
