import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@apps/gateway/prisma/prisma.service';
import {
  PostItem,
  PostOutputDto,
  postOutputDtoMapper,
} from '@apps/gateway/src/features/posts/api/dto/output/post.output.dto';
import { InterlayerNotice } from '@libs/base/models/Interlayer';
import { PaginationQueryDto } from '@apps/gateway/src/features/posts/api/dto/input/pagination-query.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(private prisma: PrismaService) {}

  public async getPostsByUserId(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<InterlayerNotice<PostOutputDto>> {
    try {
      const { page, limit } = paginationQuery;
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          where: { userId, deletedAt: null },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.post.count(),
      ]);

      const totalPages = Math.ceil(total / limit);

      const notice = new InterlayerNotice<PostOutputDto>(null);

      const mappedData = posts.map(postOutputDtoMapper);

      const mappedDataWithPagination = {
        items: mappedData,
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
      };

      notice.addData(mappedDataWithPagination);

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

  public async getPostById(id: string): Promise<InterlayerNotice<PostItem>> {
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

      const notice = new InterlayerNotice<PostItem>(null);

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
