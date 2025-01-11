import { HttpException, HttpStatus } from '@nestjs/common';

export class GoneException extends HttpException {
  constructor(response: string | Record<string, any>) {
    super(response, HttpStatus.GONE);
  }
}
