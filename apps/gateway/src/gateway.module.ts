import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayController } from '@apps/gateway/src/gateway.controller';
import { GatewayService } from './gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FilesModule } from '@apps/files/src/files.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, {
  Configuration,
  validate,
} from '@settings/configuration';
import { EnvironmentsEnum } from '@settings/env-settings';
import { LoggerMiddleware } from '@infrastructure/middlewares/logger.middleware';
import { CqrsModule } from '@nestjs/cqrs';
import * as process from 'process';
import { config } from 'dotenv';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersModule } from '@apps/gateway/src/features/users/users.module';

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
    ClientsModule.registerAsync([
      {
        name: 'FILES_SERVICE',
        imports: [ConfigModule], // Импортируем ConfigModule для доступа к конфигурации
        useFactory: async (
          configService: ConfigService<Configuration, true>,
        ) => {
          const apiSettings = configService.get('apiSettings', { infer: true });

          return {
            transport: Transport.TCP,
            options: {
              host: apiSettings.FILES_SERVICE_HOST, // Получаем хост из конфигурации
              port: apiSettings.FILES_SERVICE_PORT, // Получаем порт из конфигурации
            },
          };
        },
        inject: [ConfigService], // Внедряем ConfigService для получения конфигурации
      },
    ]),
    FilesModule,
    PrismaModule,
    UsersModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
