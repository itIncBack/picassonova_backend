import { Injectable } from '@nestjs/common';
import { NodeMailer } from '@infrastructure/servises/nodemailer/nodemailer.service';
import { JwtService } from '@nestjs/jwt';
import { HashBuilder } from '@infrastructure/servises/hash-builder/hash-builder';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';

@Injectable()
export class SharedService {
  constructor(
    private readonly hashBuilder: HashBuilder,
    protected readonly nodeMailer: NodeMailer,
    protected readonly jwtService: JwtService,
  ) {}

  public async isCorrectPass(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return this.hashBuilder.compare(password, userPassword);
  }

  async generatePasswordHash(password: string): Promise<string> {
    return await this.hashBuilder.hash(password);
  }

  async generateConfirmationCode(
    userName: string,
    options?: JwtSignOptions,
  ): Promise<string> {
    return await this.jwtService.signAsync({ user_name: userName }, options);
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
