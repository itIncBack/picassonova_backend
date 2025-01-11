import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
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
import { BearerAuthGuard } from '@libs/guards/bearer-auth-guard.service';
import { ApiMeDocs } from '@apps/gateway/src/features/auth/decorators/api-me-docs.decorator';
import { GoogleAuthGuard } from '@libs/guards/google-auth-guard.service';
import { User } from '@prisma/client';
import { generateUrl } from '@libs/utils/utils';
import { EnvironmentsEnum } from '@settings/env-settings';
import { APISettings } from '@settings/api-settings';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@settings/configuration';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly apiSettings: APISettings;

  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly configService: ConfigService<ConfigurationType, true>,
  ) {
    this.apiSettings = this.configService.get('apiSettings', { infer: true });
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Initiates the Google OAuth process
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as Omit<User, 'password'>;
    const ipAddress = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const tokens = await this.authService.googleAuthRedirect({
      userId: user.id,
      userAgent,
      ipAddress,
    });

    const link =
      this.apiSettings.ENV === EnvironmentsEnum.PRODUCTION
        ? `https://picassonova.online/auth/google`
        : `http://localhost:3000/auth/google`;

    const url = generateUrl(link, {});

    this.cookieService.setCookie(
      res,
      COOKIE_KEY.REFRESH_TOKEN,
      tokens.refreshToken,
    );

    res.redirect(url);
  }

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

  @ApiMeDocs()
  @UseGuards(BearerAuthGuard)
  @Get('me')
  async me(@Req() request: Request) {
    const userId = request.currentUserId;

    return await this.authService.me(userId);
  }
}
