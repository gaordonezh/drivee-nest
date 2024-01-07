import { prop } from '@typegoose/typegoose';

export class VehicleDetailsModel {
  @prop({ required: true, type: String })
  title: string;

  @prop({ required: true, type: String })
  value: string;
}
