import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '@infrastructure/decorators/transform/trim';

export const USER_NAME_MIN_LENGTH = 6;
export const USER_NAME_MAX_LENGTH = 30;

export const IsUserNameDecorator = () =>
  applyDecorators(
    Trim(),
    IsString({ message: 'User name must be a string' }),
    Length(USER_NAME_MIN_LENGTH, USER_NAME_MAX_LENGTH, {
      message: `User name must be between ${USER_NAME_MIN_LENGTH} and ${USER_NAME_MAX_LENGTH} characters`,
    }),
    IsNotEmpty({ message: 'User name is required' }),
  );
