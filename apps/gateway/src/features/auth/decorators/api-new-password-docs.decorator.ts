import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BadRequestSchema } from '@apps/gateway/src/features/auth/swagger/schemas/bad-request.schema';

export function ApiNewPasswordDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Set a new password',
      description:
        'Allows a user to set a new password by providing a recovery code received via email.',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'The request was successful. The response does not contain any content. This behavior ensures that email detection is prevented even if the email is not registered.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Occurs when the input model contains invalid data, such as an improperly formatted email (e.g., 222^gmail.com) or other validation errors.',
      schema: BadRequestSchema,
    }),
  );
}
