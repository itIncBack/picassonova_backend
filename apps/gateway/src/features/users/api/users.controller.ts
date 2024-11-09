import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '@apps/gateway/src/features/users/application/users.service';
import { CreateUserDto } from '@apps/gateway/src/features/users/api/dto/input/create-user.input.dto';

@Controller('/gateway/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async get(@Body() input: CreateUserDto) {
    const { email } = input;

    return await this.usersService.createUser(email);
  }
}
