import { modelOptions, plugin, prop, Severity } from '@typegoose/typegoose';
import paginationPlugin from 'typegoose-cursor-pagination';
import { UserReferenceModel } from 'src/vehicles/models/user.reference.schema';
import { VehicleReferenceModel } from 'src/comments/models/vehicle.reference.schema';
import { Date } from 'mongoose';
import { BookingStatusEnum } from './booking.enum';

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: {
    timestamps: true,
    toObject: {
      getters: true,
      virtuals: false,
    },
  },
})
@plugin(paginationPlugin)
export class Booking {
  @prop({ required: true, type: UserReferenceModel, _id: false })
  user: UserReferenceModel;

  @prop({ required: true, type: VehicleReferenceModel, _id: false })
  vehicle: VehicleReferenceModel;

  @prop({ required: true, type: Date })
  startDatetime: Date;

  @prop({ required: true, type: Date })
  endDatetime: Date;

  @prop({ required: true, type: Number })
  totalPrice: number;

  @prop({ required: true, type: Number })
  totalHours: number;

  @prop({ required: true, enum: BookingStatusEnum, default: BookingStatusEnum.PENDING })
  status: BookingStatusEnum;

  @prop({ required: false, type: String })
  comment: string;
}
