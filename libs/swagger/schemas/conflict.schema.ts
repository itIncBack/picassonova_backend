import { HttpStatus } from '@nestjs/common';

export const ConflictSchema = {
  example: {
    data: null,
    code: HttpStatus.CONFLICT,
    extensions: [
      {
        message: 'Any massage',
        field: null,
      },
    ],
  },
};
