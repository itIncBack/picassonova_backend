import { Module, Provider } from '@nestjs/common';
import { CookieService } from '@infrastructure/servises/cookie/cookie.service';
import { NodeMailer } from '@infrastructure/servises/nodemailer/nodemailer.service';
import { HashBuilder } from '@infrastructure/servises/hash-builder/hash-builder';
import { SharedService } from '@infrastructure/servises/shared/shared.service';

const basesProviders: Provider[] = [
  SharedService,
  HashBuilder,
  NodeMailer,
  CookieService,
];

@Module({
  imports: [],
  providers: [...basesProviders],
  exports: [...basesProviders],
})
export class SharedModule {}
