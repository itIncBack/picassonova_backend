import { Post, PostImages } from '@prisma/client';

export class PostImageDto {
  id: string;
  imageUrl: string;
  createdAt: string;
}

export class PostOutputDto {
  id: string;
  userId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  postImages: PostImageDto[];
}

// MAPPERS
export const postOutputDtoMapper = (
  post: Post & { postImages: PostImages[] },
): PostOutputDto => {
  const outputDto = new PostOutputDto();

  outputDto.id = post.id;
  outputDto.userId = post.userId;
  outputDto.description = post.description;
  outputDto.createdAt = post.createdAt.toISOString();
  outputDto.updatedAt = post.updatedAt.toISOString();
  outputDto.postImages =
    post.postImages?.map((pi) => ({
      id: pi.id,
      imageUrl: pi.imageUrl,
      createdAt: pi.createdAt.toISOString(),
    })) || [];

  return outputDto;
};
