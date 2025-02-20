import { Injectable } from '@nestjs/common';
import { NodeMailer } from '@infrastructure/servises/nodemailer/nodemailer.service';
import { JwtService } from '@nestjs/jwt';
import { HashBuilder } from '@infrastructure/servises/hash-builder/hash-builder';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { JwtPayload } from 'jsonwebtoken';
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
      userId,
      deviceId,
      sessionId,
    };

    return await this.jwtService.signAsync(payload, options);
  }

  public verifyToken(
    refreshToken?: string,
  ): { userId: string; deviceId: string; sessionId: string } | null {
    try {
      if (refreshToken) {
        const { userId, deviceId, sessionId } =
          (this.jwtService.verify(refreshToken) as JwtPayload) ?? {};

        return { userId, deviceId, sessionId };
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
    const payload = { userId };

    return await this.jwtService.signAsync(payload, options);
  }

  verifyConfirmationCode(token?: string): { userId: string } | null {
    try {
      if (token) {
        const { userId } = (this.jwtService.verify(token) as JwtPayload) ?? {};

        return { userId };
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
        ? `https://picassonova.online/auth/email-confirm?code=${confirmationCode}&email=${to}`
        : `http://localhost:3000/auth/email-confirm?code=${confirmationCode}&email=${to}`;
    const subject = 'Confirm your email address';
    const text = `Please confirm your email address by clicking the following link: link`;
    const html = `<p>Please confirm your email address by clicking the link below:</p><p><a href="${link}">Confirm Email</a></p>`;

    this.nodeMailer.sendMail(to, subject, text, html);
  }

  public async sendRecoveryPassEmail(to: string, confirmationCode: string) {
    const apiSettings = this.getApiSettings();

    const link =
      apiSettings.ENV === EnvironmentsEnum.PRODUCTION
        ? `https://picassonova.online/auth/create-new-password?code=${confirmationCode}&email=${to}`
        : `http://localhost:3000/auth/create-new-password?code=${confirmationCode}&email=${to}`;

    const subject = 'Password recovery';
    const text = `To finish password recovery please follow the link below: link`;
    const html = `<p>To finish password recovery please follow the link below:</p><p><a href="${link}">Password recovery</a></p>`;

    this.nodeMailer.sendMail(to, subject, text, html);
  }
}
