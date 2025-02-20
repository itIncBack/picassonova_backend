import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { DELETE_IMG, UPLOAD_IMG } from '@libs/base/constants/messages-patterns';

@Injectable()
export class GatewayService {
  constructor(@Inject('FILES_SERVICE') private readonly client: ClientProxy) {}

  async uploadImg(file: Express.Multer.File) {
    const res = this.client.send(UPLOAD_IMG, file);

    return lastValueFrom(res);
  }

  async deletePostImg(imgId: string) {
    const res = this.client.send(DELETE_IMG, imgId);

    return lastValueFrom(res);
  }
}
