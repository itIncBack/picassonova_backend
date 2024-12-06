import { Injectable } from '@nestjs/common';
import { Response, Request, CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@settings/configuration';
import { EnvironmentSettings } from '@settings/env-settings';

@Injectable()
export class CookieService {
  private readonly environmentSettings: EnvironmentSettings;

  constructor(
    private readonly configService: ConfigService<ConfigurationType, true>,
  ) {
    this.environmentSettings = configService.get('environmentSettings', {
      infer: true,
    });
  }
  // Метод для установки cookie
  setCookie(
    res: Response,
    name: string,
    value: string,
    options: CookieOptions = {},
  ): void {
    res.cookie(name, value, {
      httpOnly: true,
      // maxAge: 24 * 60 * 60 * 1000, // 1 day
      // secure: true,
      // sameSite: 'none',
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
      // maxAge: 0, // 1 day
      // secure: true,
      // sameSite: 'none',
      ...options,
    });
  }
}
