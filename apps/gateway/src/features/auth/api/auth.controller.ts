import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SignUpInputDto } from './dto/input/sign-up.input.dto';
import { SignInInputDto } from '@apps/gateway/src/features/auth/api/dto/input/sign-in.input.dto';
import { Response, Request } from 'express';
import { AuthService } from '@apps/gateway/src/features/auth/application/auth.service';
import { VerifyEmailInputDto } from '@apps/gateway/src/features/auth/api/dto/input/verify-email.input.dto';
import { ResendVerificationEmailInputDto } from '@apps/gateway/src/features/auth/api/dto/input/resend-verification-email.input.dto';
import { ApiSignInDocs } from '@apps/gateway/src/features/auth/decorators/api-sign-in-docs.decorator';
import { ApiSignUpDocs } from '@apps/gateway/src/features/auth/decorators/api-sign-up-docs.decorator';
import { ApiVerifyEmailDocs } from '@apps/gateway/src/features/auth/decorators/api-verify-email-docs.decorator';
import { ApiResendVerificationEmailDocs } from '@apps/gateway/src/features/auth/decorators/api-resend-verification-email-docs.decorator';
import { ApiLogoutDocs } from '@apps/gateway/src/features/auth/decorators/api-logout-docs.decorator';
import { PasswordRecoveryDto } from '@apps/gateway/src/features/auth/api/dto/input/password-recovery.input.dto';
import { ApiPasswordRecoveryDocs } from '@apps/gateway/src/features/auth/decorators/api-password-recovery-docs.decorator';
import { NewPasswordDto } from '@apps/gateway/src/features/auth/api/dto/input/new-password.input.dto';
import { ApiNewPasswordDocs } from '@apps/gateway/src/features/auth/decorators/api-new-password-docs.decorator';
import { ApiRefreshTokenDocs } from '@apps/gateway/src/features/auth/decorators/api-refresh-token-docs.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiSignUpDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  async signUp(@Body() input: SignUpInputDto) {
    const { user_name, password, email } = input;

    return this.authService.signUp(user_name, password, email);
  }

  @Post('sign-in')
  @ApiSignInDocs()
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() input: SignInInputDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const { email, password } = input;

    return this.authService.signIn(email, password, res, req);
  }

  @Post('verify-email')
  @ApiVerifyEmailDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyEmail(@Body() input: VerifyEmailInputDto) {
    const { code } = input;

    return this.authService.verifyEmail(code);
  }

  @Post('resend-verification-email')
  @ApiResendVerificationEmailDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendVerificationEmail(
    @Body() input: ResendVerificationEmailInputDto,
  ) {
    const { email } = input;

    return this.authService.resendVerificationEmail(email);
  }

  @Post('logout')
  @ApiLogoutDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }

  @Post('password-recovery')
  @ApiPasswordRecoveryDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() input: PasswordRecoveryDto) {
    const { email, recaptcha_token } = input;

    await this.authService.passwordRecovery(email, recaptcha_token);
  }

  @Post('new-password')
  @ApiNewPasswordDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() input: NewPasswordDto) {
    const { new_password, recovery_code } = input;

    await this.authService.newPassword(new_password, recovery_code);
  }

  @Post('refresh-token')
  @ApiRefreshTokenDocs()
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refreshTokens(req, res);
  }
}
