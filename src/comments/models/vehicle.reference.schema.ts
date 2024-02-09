import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { AddressModel } from 'src/users/model/address.schema';
import { Users } from 'src/users/model/users.schema';
import { Vehicles } from 'src/vehicles/models/vehicle.schema';

export class VehicleReferenceModel {
  @prop({ required: true, type: Types.ObjectId, ref: () => Vehicles })
  id: string;

  @prop({ required: true, type: String })
  name: string;

  @prop({ required: true, type: String })
  description: string;

  @prop({ required: false, type: String })
  image: string;

  @prop({ required: false, type: AddressModel, _id: false })
  address: AddressModel;

  @prop({ required: false, type: Number })
  pricexhour: number;

  @prop({ required: false, type: Types.ObjectId, ref: () => Users })
  owner: string;
}
