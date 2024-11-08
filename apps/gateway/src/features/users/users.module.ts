import { Module, Provider } from '@nestjs/common';
import { UsersController } from '@apps/gateway/src/features/users/api/users.controller';
import { UsersRepository } from '@apps/gateway/src/features/users/infrastructure/users.repository';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersService } from '@apps/gateway/src/features/users/application/users.service';

const usersProviders: Provider[] = [UsersRepository, UsersService];

@Module({
  imports: [PrismaModule],
  providers: [...usersProviders],
  controllers: [UsersController],
  exports: [UsersRepository],
})
export class UsersModule {}
