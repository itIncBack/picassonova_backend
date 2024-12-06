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
import { COOKIE_KEY } from '@libs/utils/consts';
import { CookieService } from '@infrastructure/servises/cookie/cookie.service';
import { SignInMapper } from '@apps/gateway/src/features/auth/api/dto/sign-in.dto';
import { SignInOutputMapper } from '@apps/gateway/src/features/auth/api/dto/output/sign-in.output.dto';
import { RefreshTokenOutputMapper } from '@apps/gateway/src/features/auth/api/dto/output/refresh-token.output.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('sign-up')
  @ApiSignUpDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  async signUp(@Body() input: SignUpInputDto) {
    const { userName, password, email } = input;

    return this.authService.signUp(userName, password, email);
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

    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    const refreshTokenFromRequest = this.cookieService.getCookie(
      req,
      COOKIE_KEY.REFRESH_TOKEN,
    );

    const payload = SignInMapper({
      ipAddress,
      userAgent,
      refreshTokenFromRequest,
      email,
      password,
    });

    const tokens = await this.authService.signIn(payload);

    this.cookieService.setCookie(
      res,
      COOKIE_KEY.REFRESH_TOKEN,
      tokens.refreshToken,
    );

    return SignInOutputMapper(tokens.accessToken);
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
    const refreshToken = this.cookieService.getCookie(
      req,
      COOKIE_KEY.REFRESH_TOKEN,
    );

    console.log('refreshToken', refreshToken);

    await this.authService.logout(refreshToken);

    this.cookieService.clearCookie(res, COOKIE_KEY.REFRESH_TOKEN);
  }

  @Post('password-recovery')
  @ApiPasswordRecoveryDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() input: PasswordRecoveryDto) {
    const { email, recaptchaToken } = input;

    await this.authService.passwordRecovery(email, recaptchaToken);
  }

  @Post('new-password')
  @ApiNewPasswordDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() input: NewPasswordDto) {
    const { newPassword, recoveryCode } = input;

    await this.authService.newPassword(newPassword, recoveryCode);
  }

  @Post('refresh-token')
  @ApiRefreshTokenDocs()
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromRequest = this.cookieService.getCookie(
      req,
      COOKIE_KEY.REFRESH_TOKEN,
    );

    const tokens = await this.authService.refreshTokens(
      refreshTokenFromRequest,
    );

    this.cookieService.setCookie(
      res,
      COOKIE_KEY.REFRESH_TOKEN,
      tokens.refreshToken,
    );

    return RefreshTokenOutputMapper(tokens.accessToken);
  }
}
