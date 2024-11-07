import { Controller } from '@nestjs/common';
import { FilesService } from './files.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @MessagePattern({ cmd: 'get-hello' })
  getHello(): string {
    return this.filesService.getHello();
  }
}
