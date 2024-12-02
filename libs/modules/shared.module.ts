import { Module, Provider } from '@nestjs/common';
import { CookieService } from '@infrastructure/servises/cookie/cookie.service';
import { NodeMailer } from '@infrastructure/servises/nodemailer/nodemailer.service';
import { HashBuilder } from '@infrastructure/servises/hash-builder/hash-builder';
import { SharedService } from '@infrastructure/servises/shared/shared.service';
import { ReCaptchaService } from '@infrastructure/servises/re-captcha/re-captcha.service';
import { HttpModule } from '@nestjs/axios';
import { HttpRequestService } from '@infrastructure/servises/http/http.service';

const basesProviders: Provider[] = [
  SharedService,
  HashBuilder,
  NodeMailer,
  CookieService,
  ReCaptchaService,
  HttpRequestService,
  HttpModule,
];

@Module({
  imports: [HttpModule],
  providers: [...basesProviders],
  exports: [...basesProviders],
})
export class SharedModule {}
