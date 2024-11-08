import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { applyAppSettings } from '@settings/apply-app-setting';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@settings/configuration';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  applyAppSettings(app);

  const configService: ConfigService<Configuration, true> =
    app.get(ConfigService);
  const apiSettings = configService.get('apiSettings', { infer: true });

  await app.listen(apiSettings.PORT, () => {
    console.log('Gateway App starting listen port: ', apiSettings.PORT);
  });
}

bootstrap();
