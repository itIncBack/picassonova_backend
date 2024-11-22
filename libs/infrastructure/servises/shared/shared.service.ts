import { Injectable } from '@nestjs/common';
import { NodeMailer } from '@infrastructure/servises/nodemailer/nodemailer.service';
import { JwtService } from '@nestjs/jwt';
import { HashBuilder } from '@infrastructure/servises/hash-builder/hash-builder';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class SharedService {
  constructor(
    private readonly hashBuilder: HashBuilder,
    protected readonly nodeMailer: NodeMailer,
    protected readonly jwtService: JwtService,
  ) {}

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
    refreshToken: string,
  ): { user_id: string; device_id: string; session_id: string } | null {
    try {
      const { user_id, device_id, session_id } =
        (this.jwtService.verify(refreshToken) as JwtPayload) ?? {};

      return { user_id, device_id, session_id };
    } catch (e) {
      return null;
    }
  }

  async generateConfirmationCode(
    email: string,
    options?: JwtSignOptions,
  ): Promise<string> {
    const payload = { email: email };

    return await this.jwtService.signAsync(payload, options);
  }

  public async sendRegisterEmail(to: string, confirmationCode: string) {
    const link = `https://blogger-platform-bay.vercel.app/api/auth/registration-confirmation?code=${confirmationCode}`;
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
