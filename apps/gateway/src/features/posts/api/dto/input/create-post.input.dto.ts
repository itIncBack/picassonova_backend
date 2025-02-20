import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePostInputDto {
  @ApiProperty({
    description: 'Post description',
    example: 'Post description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: true,
    description: 'Upload photos',
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  photos?: Express.Multer.File[];
}
