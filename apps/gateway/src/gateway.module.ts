import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import {
  ClientOptions,
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { AuthModule } from '../../auth/src/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, {
  ConfigurationType,
  validate,
} from '@settings/configuration';
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
    AuthModule,
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    {
      provide: 'AUTH_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: String(process.env.AUTH_SERVICE_HOST),
            port: Number(process.env.AUTH_SERVICE_PORT),
          },
        });
      },
    },
  ],
})
export class GatewayModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
