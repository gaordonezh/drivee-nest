import { Ref, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Vehicles } from 'src/vehicles/models/vehicle.schema';

export class VehicleReferenceModel {
  @prop({ required: true, type: String })
  name: string;

  @prop({ required: true, type: String })
  description: string;

  @prop({ required: true, type: Types.ObjectId, ref: () => Vehicles })
  id: Ref<Vehicles, string>;
}
