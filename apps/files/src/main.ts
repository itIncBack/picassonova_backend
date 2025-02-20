import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as process from 'process';
import { config } from 'dotenv';
import { FilesModule } from '@apps/files/src/files.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FilesModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: Number(process.env.FILES_SERVICE_PORT),
      },
    },
  );

  await app.listen();

  console.log(
    'Files App starting listen port: ',
    process.env.FILES_SERVICE_PORT,
  );
}

config();
bootstrap();
