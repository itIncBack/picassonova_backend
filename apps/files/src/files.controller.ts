import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { FilesService } from './files.service';
import { DELETE_IMG, UPLOAD_IMG } from '@libs/base/constants/messages-patterns';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @MessagePattern({ cmd: 'get-hello' })
  getHello(): string {
    return this.filesService.getHello();
  }

  @MessagePattern(UPLOAD_IMG)
  async uploadFile(file: Express.Multer.File) {
    return await this.filesService.savePostImg(file);
  }

  @MessagePattern(DELETE_IMG)
  async deleteFile(id: string) {
    return await this.filesService.deletePostImg(id);
  }
}
