import { Post, PostImages } from '@prisma/client';

export class PostImageDto {
  id: string;
  imageUrl: string;
  createdAt: string;
}

export class PostItem {
  id: string;
  userId: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  postImages: PostImageDto[];
}

export class PostOutputDto {
  items: PostItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// MAPPERS
export const postOutputDtoMapper = (
  post: Post & { postImages: PostImages[] },
): PostItem => {
  const outputDto = new PostItem();

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
