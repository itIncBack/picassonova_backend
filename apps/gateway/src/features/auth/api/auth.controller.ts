import { ApiResponse, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
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
  @ApiResponse({
    status: HttpStatus.OK,
    schema: AccessTokenSchema,
    description:
      'Returns JWT accessToken (expired after 24h) in body and JWT refreshToken in cookie (http-only, secure) (expired after 48 hours).',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The user already exists or the provided data is invalid.',
    schema: BadRequestSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'If the password or email is wrong',
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
}
