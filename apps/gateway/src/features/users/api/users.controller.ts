import { Controller } from '@nestjs/common';
import { UsersService } from '@apps/gateway/src/features/users/application/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
