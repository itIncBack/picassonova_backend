import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GatewayModule } from '../../gateway/src/gateway.module';
import * as process from 'process';
import { config } from 'dotenv';


async function bootstrap() {
  config();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(GatewayModule, {
    transport: Transport.TCP,
    options: { host: `${process.env.HOST}` , port: Number(process.env.AUTH_PORT) },
  });


  await app.listen();
}

bootstrap();
