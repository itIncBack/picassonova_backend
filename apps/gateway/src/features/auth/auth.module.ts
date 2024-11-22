import { forwardRef, Module, Provider } from '@nestjs/common';
import { AuthController } from '@apps/gateway/src/features/auth/api/auth.controller';
import { AuthService } from '@apps/gateway/src/features/auth/application/auth.service';
import { UsersModule } from '@apps/gateway/src/features/users/users.module';
import { SharedModule } from '@libs/modules/shared.module';
import { SessionModule } from '@apps/gateway/src/features/session/session.module';

const authProviders: Provider[] = [AuthService];

@Module({
  imports: [
    SharedModule,
    forwardRef(() => UsersModule),
    forwardRef(() => SessionModule),
  ],
  providers: [...authProviders],
  controllers: [AuthController],
})
export class AuthModule {}
