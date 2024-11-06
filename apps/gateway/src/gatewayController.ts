import { Controller, Get, Inject } from "@nestjs/common";
import { GatewayService } from './gateway.service';
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy
  ) {}

  @Get(':id')
  getHello(): Observable<any> {
    // return this.gatewayService.getHello();
    return this.client.send({ cmd: 'get-hello' }, { id: 1 });

  }
}