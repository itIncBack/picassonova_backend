import { Injectable } from '@nestjs/common';
import { Response, Request, CookieOptions } from 'express';

@Injectable()
export class CookieService {
  // Метод для установки cookie
  setCookie(
    res: Response,
    name: string,
    value: string,
    options: CookieOptions = {},
  ): void {
    res.cookie(name, value, {
      httpOnly: true,
      //TODO: secure: false, временно для разработки
      secure: false,
      //TODO: sameSite: 'lax', временно для разработки потом вернуть на none
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      ...options,
    });
  }

  // Метод для получения cookie
  getCookie(req: Request, name: string): string | undefined {
    return req.cookies[name];
  }

  // Метод для удаления cookie
  clearCookie(res: Response, name: string, options?: CookieOptions): void {
    res.clearCookie(name, {
      httpOnly: true,
      //TODO: secure: false, временно для разработки
      secure: false,
      //TODO: sameSite: 'lax', временно для разработки потом вернуть на none
      sameSite: 'lax',
      ...options,
    });
  }
}
