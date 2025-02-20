import { forwardRef, Module, Provider } from '@nestjs/common';

import { PostsService } from '@apps/gateway/src/features/posts/application/posts.service';
import { PostsController } from '@apps/gateway/src/features/posts/api/posts.controller';
import { GatewayModule } from '@apps/gateway/src/gateway.module';
import { PrismaModule } from '@apps/gateway/prisma/prisma.module';
import { PostsRepository } from '@apps/gateway/src/features/posts/infrastructure/posts.repository';
import { PostsQueryRepository } from '@apps/gateway/src/features/posts/infrastructure/posts.query.repository';

const postsProviders: Provider[] = [
  PostsRepository,
  PostsService,
  PostsQueryRepository,
];

@Module({
  imports: [PrismaModule, forwardRef(() => GatewayModule)],
  providers: [...postsProviders],
  controllers: [PostsController],
  exports: [],
})
export class PostsModule {}
