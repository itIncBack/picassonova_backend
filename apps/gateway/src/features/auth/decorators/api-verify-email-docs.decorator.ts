import { BadRequestSchema } from '../swagger/schemas/bad-request.schema';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiVerifyEmailDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Confirmation',
      description: 'Confirm registration',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Email was verified. Account was activated',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'If the confirmation code is incorrect, expired or already been applied',
      schema: BadRequestSchema,
    }),
  );
}
