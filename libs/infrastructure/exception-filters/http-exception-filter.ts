import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import {
  InterlayerNotice,
  InterlayerNoticeExtension,
} from '@libs/base/models/Interlayer';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const notice = new InterlayerNotice<null>(null);

    const responseBody: any = exception.getResponse();
    const isResponseObject = typeof responseBody === 'object';
    const messages = Array.isArray(responseBody?.message)
      ? responseBody.message
      : [responseBody?.message || 'An unexpected error occurred'];

    // Handle specific 404 error
    if (status === HttpStatus.NOT_FOUND) {
      notice.code = status;
      notice.addError(
        'Resource not found',
        `The requested URL ${request.url} was not found on the server.`,
        status,
      );
      return response.status(status).json(notice);
    }

    // Handle specific 401 error
    if (status === HttpStatus.UNAUTHORIZED) {
      notice.code = status;
      notice.addError(
        'Unauthorized',
        'Authentication is required to access this resource. Please provide valid credentials.',
        status,
      );
      return response.status(status).json(notice);
    }

    messages.forEach((message) => {
      const key = isResponseObject ? responseBody.key : null;
      notice.extensions.push(new InterlayerNoticeExtension(message, key));
    });

    notice.code = status;

    if (
      ![
        HttpStatus.BAD_REQUEST,
        HttpStatus.FORBIDDEN,
        HttpStatus.GONE,
        HttpStatus.CONFLICT,
      ].includes(status)
    ) {
      notice.addError('An error occurred', null, status);
      notice.extensions.push(
        new InterlayerNoticeExtension(
          'Error details',
          `Status: ${status}, Path: ${request.url}, Timestamp: ${new Date().toISOString()}`,
        ),
      );
    }

    response.status(status).json(notice);
  }
}
