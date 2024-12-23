import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';

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
}
