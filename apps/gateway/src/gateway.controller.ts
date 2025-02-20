import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { REDIRECT_TO_FILE_SERVICE } from '@libs/base/constants/messages-patterns';

@Controller()
export class GatewayController {
  constructor(@Inject('FILES_SERVICE') private readonly client: ClientProxy) {}

  @Get('/files')
  redirectToFileService(): Observable<any> {
    return this.client.send({ cmd: REDIRECT_TO_FILE_SERVICE }, { id: 1 });
  }
}
