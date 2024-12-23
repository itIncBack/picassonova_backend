import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { NotFoundSchema } from '@apps/gateway/src/common/swagger/schemas/not-found.schema';
import { ForbiddenSchema } from '@apps/gateway/src/common/swagger/schemas/forbidden-schema';

export function ApiDeletePostDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete post',
      description: 'Allows a registered user delete his post.',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'The request was successful. The response does not contain any content.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Occurs when userId is undefined.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Occurs when post does not exists.',
      schema: NotFoundSchema,
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'Occurs when a user tries to delete a post that does not belong to them.',
      schema: ForbiddenSchema,
    }),
  );
}
