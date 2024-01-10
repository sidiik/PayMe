import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class reqPagination {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Math.max(parseInt(value), 1) || 1)
  page: number = 1;
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Math.max(Math.min(value, 100), 1) || 5)
  size: number = 5;
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
