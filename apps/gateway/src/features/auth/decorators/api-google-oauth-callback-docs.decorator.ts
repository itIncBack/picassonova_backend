import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGoogleOAutCallBackDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Handle Google OAuth callback',
      description: `Handles the callback from Google after user authentication. 
    This endpoint redirects the user to the frontend at 
    "https://picassonova.online/auth/google" and sets a cookie with the 
    refresh token.`,
    }),
    ApiResponse({
      status: 302,
      description: `Redirects user to the frontend URL "https://picassonova.online/auth/google". 
    Sets the cookie "REFRESH_TOKEN" containing the refresh token.`,
    }),
  );
}
