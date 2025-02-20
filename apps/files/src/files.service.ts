import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostImg } from '@apps/files/src/schemas/post-img.schema';
import { getCurrentISOStringDate } from '@libs/utils/dates';
import {
  BUCKET_NAME,
  S3_ENDPOINT,
} from '@apps/files/src/base/constants/s3-bucket-constants';
import { S3Service } from '@apps/files/src/infrastructure/services/s3service.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectModel(PostImg.name) private postImgModel: Model<PostImg>,
  ) {}

  async savePostImg(file: Express.Multer.File) {
    const fileExtension =
      file.originalname.split('.')[file.originalname.split('.').length - 1];

    const imageUrl = `uploads/${crypto.randomUUID()}.${fileExtension}`;

    try {
      await this.uploadFile({
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
      imgId: String(imgInDb._id),
    };
  }

  async deletePostImg(id: string) {
    const res = await this.postImgModel.findByIdAndUpdate<PostImg>(id, {
      deletedAt: getCurrentISOStringDate(),
    });

    return !!res;
  }

  async uploadFile(file: {
    mimetype: string;
    filePath: string;
    fileBuffer: Buffer;
    fileSize: number;
  }) {
    await this.s3Service.uploadFile(file);
  }
}
