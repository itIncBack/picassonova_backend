import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PostsRepository } from '@apps/gateway/src/features/posts/infrastructure/posts.repository';
import { CreatePostInputDto } from '@apps/gateway/src/features/posts/api/dto/input/create-post.input.dto';
import { GatewayService } from '@apps/gateway/src/gateway.service';
import { UpdatePostInputDto } from '@apps/gateway/src/features/posts/api/dto/input/update-post.input.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly gatewayService: GatewayService,
  ) {}

  async createPost(
    userId: string | undefined,
    dto: CreatePostInputDto,
    imgs: Express.Multer.File[],
  ) {
    if (!userId) {
      throw new ForbiddenException();
    }

    if (!imgs || imgs.length === 0) {
      throw new BadRequestException();
    }

    //todo add type add transaction?
    const imgsFromMicroservice: { imgId: string; imgUrl: string }[] =
      await Promise.all(
        imgs.map(async (i) => {
          return this.gatewayService.uploadImg(i);
        }),
      );

    const post = await this.postsRepository.createPost({
      userId,
      description: dto.description,
    });

    await Promise.all(
      imgsFromMicroservice.map(async (u) => {
        return this.postsRepository.createPostUrl({
          id: u.imgId,
          postId: post.id,
          imageUrl: u.imgUrl,
        });
      }),
    );

    return post.id;
  }

  async updatePost(
    userId: string | undefined,
    postId: string,
    dto: UpdatePostInputDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException();
    }

    const post = await this.postsRepository.getPostsById(postId);

    if (!post || post.deletedAt) {
      throw new NotFoundException('Post was not found');
    }

    if (userId !== post.userId) {
      throw new ForbiddenException();
    }

    return this.postsRepository.updatePost(postId, dto);
  }

  async deletePostById(userId: string | undefined, postId: string) {
    if (!userId) {
      throw new UnauthorizedException();
    }

    const post = await this.postsRepository.getPostsById(postId);

    if (!post || post.deletedAt) {
      throw new NotFoundException('Post was not found');
    }

    if (userId !== post.userId) {
      throw new ForbiddenException();
    }

    if (post.postImages) {
      const deletePromises = post.postImages.map((pi) => {
        return Promise.all([
          this.gatewayService.deletePostImg(pi.id),
          this.postsRepository.deletePostImg(pi.id),
        ]);
      });

      await Promise.all(deletePromises);
    }

    return this.postsRepository.deletePost(postId);
  }
}
