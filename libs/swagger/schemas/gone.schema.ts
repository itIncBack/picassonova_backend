import { HttpStatus } from '@nestjs/common';

export const GoneSchema = {
  example: {
    data: null,
    code: HttpStatus.GONE,
    extensions: [
      {
        message: 'Any massage',
        field: null,
      },
    ],
  },
};
