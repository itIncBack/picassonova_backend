import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '@infrastructure/decorators/transform/trim';

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;
export const IsPasswordDecorator = () =>
  applyDecorators(
    Trim(),
    IsString({ message: 'Password must be a string' }),
    Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, {
      message: 'Password must be between 6 and 20 characters',
    }),
    IsNotEmpty({ message: 'Password is required' }),
  );
