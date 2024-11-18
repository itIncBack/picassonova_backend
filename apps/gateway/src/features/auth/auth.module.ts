import { forwardRef, Module, Provider } from '@nestjs/common';
import { AuthController } from '@apps/gateway/src/features/auth/api/auth.controller';
import { AuthService } from '@apps/gateway/src/features/auth/application/auth.service';
import { SignUpHandler } from '@apps/gateway/src/features/auth/application/handlers/sign-up.handler';
import { UsersModule } from '@apps/gateway/src/features/users/users.module';
import { SharedModule } from '../../../../../libs/modules/shared.module';

const authProviders: Provider[] = [AuthService, SignUpHandler];

@Module({
  imports: [SharedModule, forwardRef(() => UsersModule)],
  providers: [...authProviders],
  controllers: [AuthController],
})
export class AuthModule {}
