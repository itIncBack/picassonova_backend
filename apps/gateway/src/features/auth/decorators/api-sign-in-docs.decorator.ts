import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenSchema } from '../swagger/schemas/success-request.schema';
import { BadRequestSchema } from '../swagger/schemas/bad-request.schema';

export function ApiSignInDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login',
      description: 'Try login user to the system',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      schema: AccessTokenSchema,
      description:
        'Returns JWT accessToken (expired after 24h) in body and JWT refreshToken in cookie (http-only, secure) (expired after 48 hours).',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'If the provided data is invalid.',
      schema: BadRequestSchema,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'If the password or email is incorrect, or the email is not confirmed.',
    }),
  );
}
