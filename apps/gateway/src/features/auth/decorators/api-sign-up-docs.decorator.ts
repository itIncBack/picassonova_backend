import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BadRequestSchema } from '@libs/swagger/schemas/bad-request.schema';

export function ApiSignUpDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Registration',
      description:
        'Registration in the system. Email with confirmation code will be sent to the provided email address.',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Successfully signed up the user. No content is returned.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'The user already exists or the provided data is invalid.',
      schema: BadRequestSchema,
    }),
  );
}
