import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '@infrastructure/decorators/transform/trim';

const min = 6;
const max = 30;

export const IsUserNameDecorator = () =>
  applyDecorators(
    Trim(),
    IsString({ message: 'User name must be a string' }),
    Length(min, max, {
      message: `User name must be between ${min} and ${max} characters`,
    }),
    IsNotEmpty({ message: 'User name is required' }),
  );
