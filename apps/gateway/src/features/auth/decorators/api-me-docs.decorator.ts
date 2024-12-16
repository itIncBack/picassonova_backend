import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';

export function ApiMeDocs() {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiOperation({
      summary: 'Get user profile',
      description: 'Returns information about the authenticated user.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns user profile information.',
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'user@example.com' },
          userName: { type: 'string', example: 'user123' },
          userId: { type: 'string', example: 'uuid-or-id-string' },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'If the bearer token is missing, invalid, or expired.',
    }),
  );
}
