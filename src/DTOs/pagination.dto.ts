import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class reqPagination {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Math.max(parseInt(value), 1) || 1)
  page: number;
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Math.max(Math.min(value, 100), 5) || 5)
  size: number;
}

export class resPagination {
  @Expose()
  page: number;
  @Expose()
  size: number;
  @Expose()
  totalPages: number;
  @Expose()
  totalCount: number;
}
