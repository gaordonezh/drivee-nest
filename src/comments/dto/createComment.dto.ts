import { Type } from 'class-transformer';
import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsString } from 'class-validator';
import { UserReferenceModel } from 'src/vehicles/models/user.reference.schema';
import { VehicleReferenceModel } from '../models/vehicle.reference.schema';

export class CreateCommentDto {
  @IsNotEmptyObject()
  @Type(() => UserReferenceModel)
  user: UserReferenceModel;

  @IsNotEmptyObject()
  @Type(() => VehicleReferenceModel)
  vehicle: VehicleReferenceModel;

  @IsNotEmpty()
  @IsNumber()
  stars: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
