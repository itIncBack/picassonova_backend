import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';

import { SuccessResponsePostSchema } from '@apps/gateway/src/features/posts/swagger/schemas/success-response-post.schema';
import { BadRequestSchema } from '@apps/gateway/src/common/swagger/schemas/bad-request.schema';
import { ForbiddenSchema } from '@apps/gateway/src/common/swagger/schemas/forbidden-schema';
import { CreatePostInputDto } from '@apps/gateway/src/features/posts/api/dto/input/create-post.input.dto';

export function ApiCreatePostDocs() {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiOperation({
      summary: 'Create a new post',
      description: 'Allows a registered user create a new post.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Create a new post with images',
      type: CreatePostInputDto,
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      schema: SuccessResponsePostSchema,
      description: 'The request was successful and return created post.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Occurs when the input model contains invalid data, such as an description length, imgs type or other validation errors.',
      schema: BadRequestSchema,
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Occurs when userId is undefined.',
      schema: ForbiddenSchema,
    }),
  );
}
