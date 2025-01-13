import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import process from 'process';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PostImg, PostImgSchema } from './schemas/post-img.schema';
import configuration, {
  ConfigurationType,
  validate,
} from '@settings/configuration';
import { EnvironmentsEnum } from '@settings/env-settings';
import { S3Service } from '@apps/files/src/infrastructure/services/s3service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      envFilePath: ['.env'],
      ignoreEnvFile:
        process.env.ENV !== EnvironmentsEnum.DEVELOPMENT &&
        process.env.ENV !== EnvironmentsEnum.TESTING,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<ConfigurationType, true>,
      ) => {
        const apiSettings = configService.get('apiSettings', { infer: true });
        return {
          uri: apiSettings.MONGO_URL,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: PostImg.name,
        schema: PostImgSchema,
      },
    ]),
  ],
  controllers: [FilesController],
  providers: [FilesService, S3Service],
  exports: [FilesService],
})
export class FilesModule {}
