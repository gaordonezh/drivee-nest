import { IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/utils/dto/globals.dto';

export class GetCommentsDto extends PaginationDto {
  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsOptional()
  @IsMongoId()
  vehicle?: string;
}
