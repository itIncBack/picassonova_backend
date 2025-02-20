import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';

import { SuccessResponsePostSchema } from '@apps/gateway/src/features/posts/swagger/schemas/success-response-post.schema';
import { NotFoundSchema } from '@libs/swagger/schemas/not-found.schema';

export function ApiGetPostDocs() {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiOperation({
      summary: 'Get post by id',
      description: 'Allows registered users get post by id.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      schema: SuccessResponsePostSchema,
      description: 'The request was successful and return post.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Occurs when post does not exists.',
      schema: NotFoundSchema,
    }),
  );
}
