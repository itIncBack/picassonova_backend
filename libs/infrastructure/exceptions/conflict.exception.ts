import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
  constructor(response: string | Record<string, any>) {
    super(response, HttpStatus.CONFLICT);
  }
}
