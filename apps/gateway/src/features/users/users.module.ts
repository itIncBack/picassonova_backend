import { Module, Provider } from '@nestjs/common';
import { UsersController } from '@apps/gateway/src/features/users/api/users.controller';
import { UsersRepository } from '@apps/gateway/src/features/users/infrastructure/users.repository';
import { PrismaModule } from '@apps/gateway/prisma/prisma.module';
import { UsersService } from '@apps/gateway/src/features/users/application/users.service';
import { ConfirmationRepository } from '@apps/gateway/src/features/users/infrastructure/confirmation.repository';

const usersProviders: Provider[] = [
  UsersRepository,
  ConfirmationRepository,
  UsersService,
];

@Module({
  imports: [PrismaModule],
  providers: [...usersProviders],
  controllers: [UsersController],
  exports: [...usersProviders],
})
export class UsersModule {}
