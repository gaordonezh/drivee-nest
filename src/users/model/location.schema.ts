import { prop } from '@typegoose/typegoose';

export class LocationModel {
  @prop({ required: true, type: Number })
  lat: number;

  @prop({ required: true, type: Number })
  lng: number;
}
