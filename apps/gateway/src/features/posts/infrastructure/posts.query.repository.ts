import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@apps/gateway/prisma/prisma.service';
import {
  PostOutputDto,
  postOutputDtoMapper,
} from '@apps/gateway/src/features/posts/api/dto/output/post.output.dto';
import { InterlayerNotice } from '@libs/base/models/Interlayer';

@Injectable()
export class PostsQueryRepository {
  constructor(private prisma: PrismaService) {}

  public async getPostsByUserId(
    userId: string,
  ): Promise<InterlayerNotice<PostOutputDto[]>> {
    try {
      //todo add pagination
      const posts = await this.prisma.post.findMany({
        where: { userId, deletedAt: null },
        include: {
          postImages: true,
        },
      });

      const notice = new InterlayerNotice<PostOutputDto[]>(null);

      const mappedData = posts.map(postOutputDtoMapper);

      notice.addData(mappedData);

      return notice;
    } catch (e) {
      console.error('Error to get users posts from database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error to get users posts from database',
      );
    }
  }

  public async getPostById(
    id: string,
  ): Promise<InterlayerNotice<PostOutputDto>> {
    try {
      const post = await this.prisma.post.findFirst({
        where: { id, deletedAt: null },
        include: {
          postImages: true,
        },
      });

      if (!post) {
        throw new NotFoundException();
      }

      const notice = new InterlayerNotice<PostOutputDto>(null);

      const mappedData = postOutputDtoMapper(post);

      notice.addData(mappedData);

      return notice;
    } catch (e) {
      console.error('Error to get users post from database:', {
        error: (e as Error).message,
      });

      if (e instanceof NotFoundException) {
        throw e;
      }

      throw new InternalServerErrorException(
        'Error to get users post from database',
      );
    }
  }
}
