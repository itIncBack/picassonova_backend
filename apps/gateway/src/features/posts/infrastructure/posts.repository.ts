import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from '@apps/gateway/prisma/prisma.service';
import { getCurrentISOStringDate } from '@libs/utils/dates';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  public async createPost(payload: { userId: string; description?: string }) {
    const { userId, description } = payload;

    try {
      return await this.prisma.post.create({
        data: {
          userId,
          description,
        },
        select: {
          id: true,
        },
      });
    } catch (e) {
      console.error('Error inserting post into database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error inserting post into database',
      );
    }
  }

  public async createPostUrl(payload: {
    id: string;
    postId: string;
    imageUrl: string;
  }) {
    const { id, postId, imageUrl } = payload;

    try {
      return await this.prisma.postImages.create({
        data: {
          id,
          postId,
          imageUrl,
        },
        select: {
          id: true,
        },
      });
    } catch (e) {
      console.error('Error inserting imageUrl into database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error inserting imageUrl into database',
      );
    }
  }

  public async getPostsById(postId: string) {
    try {
      return await this.prisma.post.findFirst({
        where: { id: postId },
        include: {
          postImages: true,
        },
      });
    } catch (e) {
      console.error('Error to get users post from database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error to get users post from database',
      );
    }
  }

  public async deletePostImg(id: string) {
    try {
      return await this.prisma.postImages.update({
        where: { id },
        data: { deletedAt: getCurrentISOStringDate() },
      });
    } catch (e) {
      console.error('Error to delete users post img from database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error to delete users post img from database',
      );
    }
  }

  public async deletePost(id: string) {
    try {
      return await this.prisma.post.update({
        where: { id },
        data: { deletedAt: getCurrentISOStringDate() },
      });
    } catch (e) {
      console.error('Error to delete users post from database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error to delete users post from database',
      );
    }
  }

  public async updatePost(id: string, dto: Partial<Post>) {
    try {
      return await this.prisma.post.update({
        where: { id },
        data: dto,
      });
    } catch (e) {
      console.error('Error to update post from database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error to update post from database',
      );
    }
  }
}
