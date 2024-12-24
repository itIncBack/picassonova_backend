import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostInputDto {
  @ApiProperty({
    description: 'Post description',
    example: 'Post description',
    minLength: 1,
    maxLength: 500,
    required: true,
  })
  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Upload photos',
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  photos?: Express.Multer.File[];
}
