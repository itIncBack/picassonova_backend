import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BadRequestSchema } from '@apps/gateway/src/features/auth/swagger/schemas/bad-request.schema';

export function ApiPasswordRecoveryDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Password recovery',
      description:
        'Password recovery via Email confirmation. Email should be sent with recovery code inside',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        "Even if current email is not registered (for prevent user's email detection)",
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'If reCAPTCHA verification unsuccessful.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'If the inputModel has invalid email (for example 222^gmail.com)',
      schema: BadRequestSchema,
    }),
  );
}
