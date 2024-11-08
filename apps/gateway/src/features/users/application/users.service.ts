import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@apps/gateway/src/features/users/infrastructure/users.repository';
import { InterlayerNotice } from '@base/models/Interlayer';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(): Promise<InterlayerNotice> {

    return await this.usersRepository.create();
  }
}
