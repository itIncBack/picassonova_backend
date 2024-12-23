import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { PostImg } from '@apps/files/src/schemas/post-img.schema';
import { getCurrentISOStringDate } from '@libs/utils/dates';
import {
  BUCKET_NAME,
  S3_ENDPOINT,
  S3_REGION,
} from '@apps/files/src/infrastructure/constants/s3-bucket-constants';
import { ConfigurationType } from '@settings/configuration';

@Injectable()
export class FilesService {
  s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService<ConfigurationType, true>,
    @InjectModel(PostImg.name) private postImgModel: Model<PostImg>,
  ) {
    const apiSettings = configService.get('apiSettings', { infer: true });

    this.s3Client = new S3Client({
      region: S3_REGION,
      endpoint: S3_ENDPOINT,
      credentials: {
        accessKeyId: apiSettings.ACCESS_KEY_ID,
        secretAccessKey: apiSettings.SECRET_ACCESS_KEY,
      },
    });
  }

  getHello(): string {
    return 'Files';
  }

  async savePostImg(file: Express.Multer.File) {
    const fileExtension =
      file.originalname.split('.')[file.originalname.split('.').length - 1];
    const imageUrl = `uploads/${crypto.randomUUID()}.${fileExtension}`;

    try {
      await this.saveFile({
        fileBuffer: file.buffer,
        filePath: imageUrl,
        fileSize: file.size,
        mimetype: file.mimetype,
      });
    } catch (e) {
      throw new Error('Cannot save file');
    }

    const imgInDb = await this.postImgModel.create<PostImg>({
      url: `${S3_ENDPOINT}/${BUCKET_NAME}/${imageUrl}`,
      createdAt: new Date(),
    });

    return {
      imgUrl: `${S3_ENDPOINT}/${BUCKET_NAME}/${imageUrl}`,
      imgId: imgInDb._id.toString(),
    };
  }

  async deletePostImg(id: string) {
    const res = await this.postImgModel.findByIdAndUpdate<PostImg>(id, {
      deletedAt: getCurrentISOStringDate(),
    });

    return !!res;
  }

  //todo move to spec service with s3Client
  async saveFile(file: {
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
