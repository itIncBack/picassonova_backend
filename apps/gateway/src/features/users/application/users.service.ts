import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@apps/gateway/src/features/users/infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(email: string): Promise<string> {
    return email;
  }
}
