import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { AccessTokenSchema } from '../swagger/schemas/success-access-token.schema';

export function ApiRefreshTokenDocs() {
  return applyDecorators(
    ApiSecurity('refreshToken'),
    ApiOperation({
      summary: 'Refresh tokens',
      description: 'Get new refresh and access token',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      schema: AccessTokenSchema,
      description:
        'Returns JWT accessToken (expired after 24h) in body and JWT refreshToken in cookie (http-only, secure) (expired after 48 hours).',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'If the refresh token in cookie is missing or incorrect.',
    }),
  );
}
