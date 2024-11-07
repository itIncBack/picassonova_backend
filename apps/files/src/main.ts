import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GatewayModule } from '../../gateway/src/gateway.module';
import * as process from 'process';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GatewayModule,
    {
      transport: Transport.TCP,
      options: {
        host: String(process.env.FILES_SERVICE_HOST),
        port: Number(process.env.FILES_SERVICE_PORT),
      },
    },
  );

  await app.listen();
}

config();
bootstrap();
