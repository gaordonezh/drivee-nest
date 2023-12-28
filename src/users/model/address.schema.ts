import { prop } from '@typegoose/typegoose';

export class AddressModel {
  @prop({ required: true, type: String })
  region: string;

  @prop({ required: true, type: String })
  province: string;

  @prop({ required: true, type: String })
  district: string;

  @prop({ required: true, type: String })
  ubigeo: string;

  @prop({ required: true, type: String })
  address: string;
}
