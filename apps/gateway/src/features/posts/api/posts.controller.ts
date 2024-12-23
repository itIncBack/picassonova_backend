import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

import { PostsService } from '@apps/gateway/src/features/posts/application/posts.service';
import { BearerAuthGuard } from '@libs/guards/bearer-auth-guard.service';
import { CreatePostInputDto } from '@apps/gateway/src/features/posts/api/dto/input/create-post.input.dto';
import { PostsQueryRepository } from '@apps/gateway/src/features/posts/infrastructure/posts.query.repository';
import { UpdatePostInputDto } from '@apps/gateway/src/features/posts/api/dto/input/update-post.input.dto';
import { PostOutputDto } from '@apps/gateway/src/features/posts/api/dto/output/post.output.dto';
import { ApiCreatePostDocs } from '@apps/gateway/src/features/posts/decorators/api-create-post-docs.decorator';
import { ApiGetPostDocs } from '@apps/gateway/src/features/posts/decorators/api-get-post-docs.decorator';
import { ApiGetPostsByUserIdDocs } from '@apps/gateway/src/features/posts/decorators/api-get-posts-by-userId-docs.decorator';
import { ApiUpdatePostDocs } from '@apps/gateway/src/features/posts/decorators/api-update-post-docs.decorator';
import { ApiDeletePostDocs } from '@apps/gateway/src/features/posts/decorators/api-delete-post-docs.decorator';
import { InterlayerNotice } from '@libs/base/models/Interlayer';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  @ApiCreatePostDocs()
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: multer.memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 }, // Ограничение на 20 МБ
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @HttpCode(HttpStatus.OK)
  async createPost(
    @Req() request: Request,
    @Body() dto: CreatePostInputDto,
    @UploadedFiles() imgs: Express.Multer.File[],
  ): Promise<InterlayerNotice<PostOutputDto>> {
    const userId = request.currentUserId;
    const postId = await this.postsService.createPost(userId, dto, imgs);

    return this.postsQueryRepository.getPostById(postId);
  }

  @Get(':userId')
  @ApiGetPostsByUserIdDocs()
  @UseGuards(BearerAuthGuard)
  async getPosts(
    @Param('userId') userId: string,
  ): Promise<InterlayerNotice<PostOutputDto[]>> {
    //todo add pagination
    return this.postsQueryRepository.getPostsByUserId(userId);
  }

  @Get('post/:postId')
  @ApiGetPostDocs()
  @UseGuards(BearerAuthGuard)
  async getPostById(
    @Param('postId') postId: string,
  ): Promise<InterlayerNotice<PostOutputDto>> {
    return this.postsQueryRepository.getPostById(postId);
  }

  @Patch(':postId')
  @ApiUpdatePostDocs()
  @UseGuards(BearerAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Req() request: Request,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostInputDto,
  ) {
    const userId = request.currentUserId;

    await this.postsService.updatePost(userId, postId, dto);
  }

  @Delete(':postId')
  @ApiDeletePostDocs()
  @UseGuards(BearerAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostById(
    @Req() request: Request,
    @Param('postId') postId: string,
  ) {
    const userId = request.currentUserId;

    await this.postsService.deletePostById(userId, postId);
  }
}
