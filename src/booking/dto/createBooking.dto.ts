import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNotEmptyObject, IsNumber, IsPositive } from 'class-validator';
import { VehicleReferenceModel } from 'src/comments/models/vehicle.reference.schema';
import { UserReferenceModel } from 'src/vehicles/models/user.reference.schema';

export class CreateBookingDto {
  @IsNotEmptyObject()
  @Type(() => UserReferenceModel)
  user: UserReferenceModel;

  @IsNotEmptyObject()
  @Type(() => VehicleReferenceModel)
  vehicle: VehicleReferenceModel;

  @IsNotEmpty()
  @IsDateString()
  startDatetime: string;

  @IsNotEmpty()
  @IsDateString()
  endDatetime: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalHours: number;
}
