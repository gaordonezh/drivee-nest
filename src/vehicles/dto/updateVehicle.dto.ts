import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  ArrayNotEmpty,
  ValidateNested,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  ArrayUnique,
} from 'class-validator';
import { UserReferenceModel } from '../models/user.reference.schema';
import { AddressModel } from 'src/users/model/address.schema';
import { VehicleStatusEnum } from '../vehicle.enum';
import { VehicleDetailsModel } from '../models/vehicle.details.schema';
import { DocumentTypesEnum } from 'src/documents/documents.enum';

export class UpdateVehicleDto {
  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => UserReferenceModel)
  user?: UserReferenceModel;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ArrayNotEmpty()
  images?: Array<string>;

  @IsOptional()
  @IsNumber()
  pricexhour?: number;

  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => AddressModel)
  address?: AddressModel;

  @IsOptional()
  @IsEnum(VehicleStatusEnum)
  status?: VehicleStatusEnum;

  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Array<VehicleDetailsModel>)
  details?: Array<VehicleDetailsModel>;

  @IsOptional()
  @IsEnum(DocumentTypesEnum, { each: true })
  @ArrayUnique()
  documents?: Array<DocumentTypesEnum>;
}
