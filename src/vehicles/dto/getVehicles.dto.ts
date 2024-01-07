import { IsMongoId, IsNotEmpty } from 'class-validator';
import { PaginationDto } from 'src/utils/dto/globals.dto';

export class GetVehiclesDto extends PaginationDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;
}
