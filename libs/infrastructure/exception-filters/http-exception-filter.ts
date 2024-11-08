import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  InterlayerNotice,
  InterlayerNoticeExtension,
} from '@base/models/Interlayer';

// https://docs.nestjs.com/exception-filters
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const notice = new InterlayerNotice<null>(null); // Создаем новый экземпляр InterlayerNotice

    if (status === HttpStatus.BAD_REQUEST) {
      const responseBody: any = exception.getResponse();

      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach((e) => {
          notice.extensions.push(
            new InterlayerNoticeExtension(e.message, e.key),
          );
        });
      } else if (typeof responseBody === 'object') {
        notice.extensions.push(
          new InterlayerNoticeExtension(responseBody.message, responseBody.key),
        );
      } else {
        notice.extensions.push(
          new InterlayerNoticeExtension(responseBody.message, null),
        );
      }

      notice.code = status; // Устанавливаем код ошибки
      response.status(status).json(notice); // Возвращаем InterlayerNotice в ответе
    } else {
      notice.addError('An error occurred', null, status);
      notice.extensions.push(
        new InterlayerNoticeExtension(
          'Error details',
          `Status: ${status}, Path: ${request.url}, Timestamp: ${new Date().toISOString()}`,
        ),
      );

      response.status(status).json(notice); // Возвращаем InterlayerNotice в ответе
    }
  }
}
