import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { SuccessResponsePostsSchema } from '@apps/gateway/src/features/posts/swagger/schemas/success-response-posts.schema';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_MAX_LIMIT,
  PAGINATION_MIN_LIMIT,
  PAGINATION_MIN_PAGE,
} from '@libs/base/constants/consts';

export function ApiGetPostsByUserIdDocs() {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiOperation({
      summary: 'Get all users posts by userId',
      description: 'Allows registered users get all users posts by userId.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      schema: SuccessResponsePostsSchema,
      description: 'The request was successful and return users posts.',
    }),
    ApiQuery({
      name: 'page',
      type: 'number',
      minimum: PAGINATION_MIN_PAGE,
      required: false,
      default: PAGINATION_DEFAULT_PAGE,
      description: 'Page number for pagination.',
    }),
    ApiQuery({
      name: 'limit',
      type: 'number',
      minimum: PAGINATION_MIN_LIMIT,
      maximum: PAGINATION_MAX_LIMIT,
      required: false,
      default: PAGINATION_DEFAULT_LIMIT,
      description: 'Number of posts per page.',
    }),
  );
}
