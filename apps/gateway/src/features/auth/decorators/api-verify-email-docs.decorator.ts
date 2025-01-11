import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoneSchema } from '@libs/swagger/schemas/gone.schema';
import { ConflictSchema } from '@libs/swagger/schemas/conflict.schema';
import { BadRequestSchema } from '@libs/swagger/schemas/bad-request.schema';

export function ApiVerifyEmailDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Confirm Email',
      description:
        'Endpoint to confirm email registration with a verification code.',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Email was verified. Account was activated',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Email verification failed. Account is already activated.',
      schema: ConflictSchema,
    }),
    ApiResponse({
      status: HttpStatus.GONE,
      description:
        'Email verification failed. The confirmation code has expired.',
      schema: GoneSchema,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'If the confirmation code is not find',
      schema: BadRequestSchema,
    }),
  );
}
