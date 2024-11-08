import { Controller, Get } from '@nestjs/common';
import { UsersService } from '@apps/gateway/src/features/users/application/users.service';

@Controller('/gateway/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/create')
  async get() {
    await this.usersService.createUser();
  }
}
