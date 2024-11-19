import { forwardRef, Module, Provider } from '@nestjs/common';
import { AuthController } from '@apps/gateway/src/features/auth/api/auth.controller';
import { AuthService } from '@apps/gateway/src/features/auth/application/auth.service';
import { SignUpHandler } from '@apps/gateway/src/features/auth/application/handlers/sign-up.handler';
import { UsersModule } from '@apps/gateway/src/features/users/users.module';
import { SharedModule } from '@libs/modules/shared.module';
import { SignInHandler } from '@apps/gateway/src/features/auth/application/handlers/sign-in.handler';
import { SessionModule } from '@apps/gateway/src/features/session/session.module';

const authProviders: Provider[] = [AuthService, SignUpHandler, SignInHandler];

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
