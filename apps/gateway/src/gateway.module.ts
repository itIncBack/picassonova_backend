import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayController } from './gatewayController';
import { GatewayService } from './gateway.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthModule } from '../../auth/src/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration, {
  validate
} from '@settings/configuration';
import { EnvironmentsEnum } from '@settings/env-settings';
import { LoggerMiddleware } from '@infrastructure/middlewares/logger.middleware';
import { CqrsModule } from '@nestjs/cqrs';
import process from 'process';



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
  providers: [GatewayService, {
    provide: 'AUTH_SERVICE',
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3002 },
      });
    },
  }],
})

export class GatewayModule implements NestModule {

  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
