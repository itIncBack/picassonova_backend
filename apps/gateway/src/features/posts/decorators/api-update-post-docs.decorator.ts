import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';

import { BadRequestSchema } from '@libs/swagger/schemas/bad-request.schema';
import { NotFoundSchema } from '@libs/swagger/schemas/not-found.schema';
import { ForbiddenSchema } from '@libs/swagger/schemas/forbidden-schema';

export function ApiUpdatePostDocs() {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiOperation({
      summary: 'Update post',
      description: 'Allows a registered user update his post.',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'The request was successful. The response does not contain any content.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Occurs when the input model contains invalid data, such as an description length or other validation errors.',
      schema: BadRequestSchema,
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
        'Occurs when a user tries to update a post that does not belong to them.',
      schema: ForbiddenSchema,
    }),
  );
}
