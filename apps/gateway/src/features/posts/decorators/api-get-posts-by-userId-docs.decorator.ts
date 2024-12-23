import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SuccessResponsePostsSchema } from '@apps/gateway/src/features/posts/swagger/schemas/success-response-posts.schema';

export function ApiGetPostsByUserIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all users posts by userId',
      description: 'Allows registered users get all users posts by userId.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      schema: SuccessResponsePostsSchema,
      description: 'The request was successful and return users posts.',
    }),
  );
}
