import { BadRequestSchema } from '../swagger/schemas/bad-request.schema';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiResendVerificationEmailDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Resend confirmation',
      description: 'Resend confirmation registration Email if user exists',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Input data is accepted. Email with confirmation code will be sent to the provided email address. The confirmation code should be inside a link as a query param, for example: https://some-front.com/confirm-registration?code=youtcodehere',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'If the email has incorrect value',
      schema: BadRequestSchema,
    }),
  );
}
