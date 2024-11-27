import { Injectable } from '@nestjs/common';
import { NodeMailer } from '@infrastructure/servises/nodemailer/nodemailer.service';
import { JwtService } from '@nestjs/jwt';
import { HashBuilder } from '@infrastructure/servises/hash-builder/hash-builder';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { JwtPayload } from 'jsonwebtoken';
import { APP_PREFIX } from '@settings/apply-app-setting';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@settings/configuration';
import { EnvironmentsEnum } from '@settings/env-settings';

@Injectable()
export class SharedService {
  constructor(
    private readonly hashBuilder: HashBuilder,
    protected readonly nodeMailer: NodeMailer,
    protected readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType, true>,
  ) {}

  private getApiSettings() {
    return this.configService.get('apiSettings', { infer: true });
  }

  public async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return this.hashBuilder.compare(password, userPassword);
  }

  async generatePasswordHash(password: string): Promise<string> {
    return await this.hashBuilder.hash(password);
  }

  public async getToken(
    userId: string,
    deviceId: string,
    sessionId: string,
    options?: JwtSignOptions,
  ) {
    const payload = {
      user_id: userId,
      device_id: deviceId,
      session_id: sessionId,
    };

    return await this.jwtService.signAsync(payload, options);
  }

  public verifyToken(
    refreshToken?: string,
  ): { user_id: string; device_id: string; session_id: string } | null {
    try {
      if (refreshToken) {
        const { user_id, device_id, session_id } =
          (this.jwtService.verify(refreshToken) as JwtPayload) ?? {};

        return { user_id, device_id, session_id };
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  async generateConfirmationCode(
    userId: string,
    options?: JwtSignOptions,
  ): Promise<string> {
    const payload = { user_id: userId };

    return await this.jwtService.signAsync(payload, options);
  }

  verifyConfirmationCode(token?: string): { user_id: string } | null {
    try {
      if (token) {
        const { user_id } = (this.jwtService.verify(token) as JwtPayload) ?? {};

        return { user_id };
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  public async sendVerifyEmail(to: string, confirmationCode: string) {
    const apiSettings = this.getApiSettings();
    const link =
      apiSettings.ENV === EnvironmentsEnum.PRODUCTION
        ? `https://picassonova.online${APP_PREFIX}/verify-email?code=${confirmationCode}`
        : `http://localhost:${apiSettings.PORT}${APP_PREFIX}/verify-email?code=${confirmationCode}`;
    const subject = 'Confirm your email address';
    const text = `Please confirm your email address by clicking the following link: link`;
    const html = `<p>Please confirm your email address by clicking the link below:</p><p><a href="${link}">Confirm Email</a></p>`;

    this.nodeMailer.sendMail(to, subject, text, html);
  }

  public async sendRecoveryPassEmail(to: string, confirmationCode: string) {
    const link = `https://blogger-platform-bay.vercel.app/api/auth/password-recovery?recoveryCode=${confirmationCode}`;
    const subject = 'Password recovery';
    const text = `To finish password recovery please follow the link below: link`;
    const html = `<p>To finish password recovery please follow the link below:</p><p><a href="${link}">Password recovery</a></p>`;

    this.nodeMailer.sendMail(to, subject, text, html);
  }
}
