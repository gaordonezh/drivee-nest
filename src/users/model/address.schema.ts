import { prop } from '@typegoose/typegoose';
import { LocationModel } from './location.schema';

export class AddressModel {
  @prop({ type: String })
  region?: string;

  @prop({ type: String })
  province?: string;

  @prop({ type: String })
  district?: string;

  @prop({ type: String })
  ubigeo?: string;

  @prop({ required: true, type: String })
  address: string;

  @prop({ required: true, type: LocationModel })
  location: LocationModel;

  @prop({ required: true, type: String })
  id: string;
}
