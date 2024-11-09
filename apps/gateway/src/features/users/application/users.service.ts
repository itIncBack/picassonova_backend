import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@apps/gateway/src/features/users/infrastructure/users.repository';
import { InterlayerNotice } from '@base/models/Interlayer';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(email: string): Promise<InterlayerNotice<User>> {
    return await this.usersRepository.create(email);
  }
}
