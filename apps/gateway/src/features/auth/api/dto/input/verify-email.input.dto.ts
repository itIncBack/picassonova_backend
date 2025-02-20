import { Trim } from '@infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailInputDto {
  @ApiProperty({
    description: 'Code that be sent via Email inside link',
    required: true,
  })
  @IsNotEmpty({ message: 'Code is required' })
  @IsString({ message: 'Code must be a string' })
  @Trim()
  code: string;
}
