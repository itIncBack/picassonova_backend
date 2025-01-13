import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  BUCKET_NAME,
  S3_ENDPOINT,
  S3_REGION,
} from '@apps/files/src/base/constants/s3-bucket-constants';
import { ConfigurationType } from '@settings/configuration';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService<ConfigurationType, true>,
  ) {
    const apiSettings = configService.get('apiSettings', { infer: true });

    this.s3Client = new S3Client({
      region: S3_REGION,
      endpoint: S3_ENDPOINT,
      credentials: {
        accessKeyId: apiSettings.YANDEX_ACCESS_KEY_ID,
        secretAccessKey: apiSettings.YANDEX_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: {
    mimetype: string;
    filePath: string;
    fileBuffer: Buffer;
    fileSize: number;
  }) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: file.filePath,
        Body: file.fileBuffer,
        ContentType: file.mimetype,
        ContentLength: file.fileSize,
      }),
    );
  }
}
