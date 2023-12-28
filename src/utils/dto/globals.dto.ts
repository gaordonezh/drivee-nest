import { IsBooleanString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsString()
  next: string;

  @IsOptional()
  @IsString()
  previous: string;

  @Transform(({ value }) => +value || 10)
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsString()
  sortField: string;

  @IsOptional()
  @IsBooleanString()
  @IsEnum(['true', 'false'])
  sortAscending: string;
}
