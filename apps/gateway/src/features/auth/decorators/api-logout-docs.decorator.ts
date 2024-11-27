import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';

export function ApiLogoutDocs() {
  return applyDecorators(
    ApiSecurity('refreshToken'),
    ApiOperation({
      summary: 'Logout',
      description:
        'Logs out the user by invalidating the refresh token stored in the cookies.',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
