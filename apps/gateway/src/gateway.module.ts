import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FilesModule } from '@apps/files/src/files.module';
import { ConfigModule } from '@nestjs/config';
import configuration, { validate } from '@settings/configuration';
import { EnvironmentsEnum } from '@settings/env-settings';
import { LoggerMiddleware } from '@infrastructure/middlewares/logger.middleware';
import { CqrsModule } from '@nestjs/cqrs';
import * as process from 'process';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      envFilePath: ['.env'],
      ignoreEnvFile:
        process.env.ENV !== EnvironmentsEnum.DEVELOPMENT &&
        process.env.ENV !== EnvironmentsEnum.TESTING,
    }),
    FilesModule,
    ClientsModule.register([
      {
        name: 'FILES_SERVICE', // Название клиента
        transport: Transport.TCP,
        options: {
          host: String(process.env.FILES_SERVICE_HOST),
          port: Number(process.env.FILES_SERVICE_PORT),
        },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    // {
    //   provide: 'FILES_SERVICE',
    //   useFactory: () => {
    //     return ClientProxyFactory.create({
    //       transport: Transport.TCP,
    //       options: {
    //         host: String(process.env.FILES_SERVICE_HOST),
    //         port: Number(process.env.FILES_SERVICE_PORT),
    //       },
    //     });
    //   },
    // },
  ],
})
export class GatewayModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
