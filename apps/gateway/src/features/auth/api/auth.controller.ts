import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
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
import { BadRequestSchema } from 'swagger/schemas/bad-request.schema';
import { SignInInputDto } from '@apps/gateway/src/features/auth/api/dto/input/sign-in.input.dto';
import { Response, Request } from 'express';
import { AccessTokenSchema } from 'swagger/schemas/success-request.schema';
import { AuthService } from '@apps/gateway/src/features/auth/application/auth.service';
import { VerifyEmailInputDto } from '@apps/gateway/src/features/auth/api/dto/input/verify-email.input.dto';
import { ResendVerificationEmailInputDto } from '@apps/gateway/src/features/auth/api/dto/input/resend-verification-email.input.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  @ApiOperation({
    summary: 'Registration',
    description:
      'Registration in the system. Email with confirmation code will be send to passed email address',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully sign_up the user. No content is returned.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The user already exists or the provided data is invalid.',
    schema: BadRequestSchema,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async signUp(@Body() input: SignUpInputDto) {
    const { user_name, password, email } = input;

    return this.authService.signUp(user_name, password, email);
  }

  @Post('sign_in')
  @ApiOperation({
    summary: 'Login',
    description: 'Try login user to the system',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: AccessTokenSchema,
    description:
      'Returns JWT accessToken (expired after 24h) in body and JWT refreshToken in cookie (http-only, secure) (expired after 48 hours).',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'If the provided data is invalid.',
    schema: BadRequestSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'If the password or email is incorrect, or the email is not confirmed.',
  })
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() input: SignInInputDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const { email, password } = input;

    return this.authService.signIn(email, password, res, req);
  }

  @Post('verify_email')
  @ApiOperation({
    summary: 'Confirmation',
    description: 'Confirm registration',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Email was verified. Account was activated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'If the confirmation code is incorrect, expired or already been applied',
    schema: BadRequestSchema,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyEmail(@Body() input: VerifyEmailInputDto) {
    const { code } = input;

    return this.authService.verifyEmail(code);
  }

  @Post('resend_verification_email')
  @ApiOperation({
    summary: 'Resend confirmation',
    description: 'Resend confirmation registration Email if user exists',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description:
      'Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'If the email has incorrect value',
    schema: BadRequestSchema,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendVerificationEmail(
    @Body() input: ResendVerificationEmailInputDto,
  ) {
    const { email } = input;

    return this.authService.resendVerificationEmail(email);
  }

  @Post('logout')
  @ApiSecurity('refreshToken')
  @ApiOperation({
    summary: 'Logout',
    description:
      'Logs out the user by invalidating the refresh token stored in the cookies.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No Content',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }
}
