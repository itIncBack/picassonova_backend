import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GatewayModule } from '../../gateway/src/gateway.module';
import * as process from 'process';
import { config } from 'dotenv';
import { FilesModule } from '@apps/files/src/files.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    // GatewayModule,
    FilesModule,
    {
      transport: Transport.TCP,
      options: {
        //host: String(process.env.FILES_SERVICE_HOST),
        host: '0.0.0.0',
        port: Number(process.env.FILES_SERVICE_PORT),
      },
    },
  );

  await app.listen();
}

config();
bootstrap();
