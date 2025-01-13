import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGoogleOAuthDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Initiate Google OAuth process',
      description: 'Starts the authentication process with Google OAuth.',
    }),
    ApiResponse({
      status: 302,
      description: 'Redirects to Google OAuth login page.',
    }),
  );
}
