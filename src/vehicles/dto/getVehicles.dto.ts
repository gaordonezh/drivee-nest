import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/utils/dto/globals.dto';
import { VehicleTypeEnum } from '../vehicle.enum';

export class GetVehiclesDto extends PaginationDto {
  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsOptional()
  @IsMongoId()
  vehicle?: string;
}

export class GetPublicVehiclesDto extends PaginationDto {
  @IsOptional()
  @IsString()
  willcard: string;

  @IsOptional()
  @IsString()
  latitude: string;

  @IsOptional()
  @IsString()
  longitude: string;

  @IsOptional()
  @IsString()
  dateFrom: string;

  @IsOptional()
  @IsString()
  dateTo: string;

  @IsOptional()
  @IsEnum(VehicleTypeEnum)
  type: VehicleTypeEnum;

  @IsOptional()
  @IsString()
  priceFrom: string;

  @IsOptional()
  @IsString()
  priceTo: string;

  @IsOptional()
  @IsMongoId()
  id: string;
}
