import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ArrayNotEmpty, ValidateNested, IsNumber, IsNotEmptyObject } from 'class-validator';
import { UserReferenceModel } from '../models/user.reference.schema';
import { AddressModel } from 'src/users/model/address.schema';
import { VehicleDetailsModel } from '../models/vehicle.details.schema';

export class CreateVehicleDto {
  @IsNotEmptyObject()
  @Type(() => UserReferenceModel)
  user: UserReferenceModel;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @ArrayNotEmpty()
  images: Array<string>;

  @IsNotEmpty()
  @IsNumber()
  pricexhour: number;

  @IsNotEmptyObject()
  @Type(() => AddressModel)
  address: AddressModel;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Array<VehicleDetailsModel>)
  details: Array<VehicleDetailsModel>;
}
