import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_MAX_LIMIT,
  PAGINATION_MIN_LIMIT,
  PAGINATION_MIN_PAGE,
} from '@libs/base/constants/consts';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION_MIN_PAGE)
  @IsOptional()
  page: number = PAGINATION_DEFAULT_PAGE;

  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION_MIN_LIMIT)
  @Max(PAGINATION_MAX_LIMIT)
  @IsOptional()
  limit: number = PAGINATION_DEFAULT_LIMIT;
}
