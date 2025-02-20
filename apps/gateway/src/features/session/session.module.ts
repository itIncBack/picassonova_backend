import { Module, Provider } from '@nestjs/common';
import { SessionsRepository } from '@apps/gateway/src/features/session/infrastructure/sessions.repository';
import { SharedModule } from '@libs/modules/shared.module';
import { SessionController } from '@apps/gateway/src/features/session/api/session.controller';
import { PrismaModule } from '@apps/gateway/prisma/prisma.module';

const sessionProviders: Provider[] = [SessionsRepository];

@Module({
  imports: [SharedModule, PrismaModule],

  providers: [...sessionProviders],
  controllers: [SessionController],
  exports: [SessionsRepository],
})
export class SessionModule {}
