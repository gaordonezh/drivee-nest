import { prop } from '@typegoose/typegoose';

export class LocationModel {
  @prop({ required: true, type: Number })
  latitude: number;

  @prop({ required: true, type: Number })
  longitude: number;
}
