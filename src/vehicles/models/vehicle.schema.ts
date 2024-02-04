import { modelOptions, plugin, prop, Severity } from '@typegoose/typegoose';
import paginationPlugin from 'typegoose-cursor-pagination';
import { AddressModel } from 'src/users/model/address.schema';
import { VehicleStatusEnum, VehicleTypeEnum } from '../vehicle.enum';
import { VehicleDetailsModel } from './vehicle.details.schema';
import { UserReferenceModel } from './user.reference.schema';
import { DocumentTypesEnum } from 'src/documents/documents.enum';

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
export class Vehicles {
  @prop({ required: true, type: UserReferenceModel, _id: false })
  user: UserReferenceModel;

  @prop({ required: true, type: String })
  name: string;

  @prop({ required: true, enum: VehicleTypeEnum })
  type: VehicleTypeEnum;

  @prop({ required: true, type: String })
  description: string;

  @prop({ type: [String], default: [] })
  images: Array<string>;

  @prop({ required: true, type: Number, default: 0.0 })
  pricexhour: number;

  @prop({ required: true, type: AddressModel, _id: false })
  address: AddressModel;

  @prop({ enum: VehicleStatusEnum, default: VehicleStatusEnum.PENDING })
  status: VehicleStatusEnum;

  @prop({ required: true, type: [VehicleDetailsModel], _id: false })
  details: Array<VehicleDetailsModel>;

  @prop({ enum: DocumentTypesEnum, default: [], type: [String] })
  documents: Array<DocumentTypesEnum>;

  @prop({ type: Boolean, default: true })
  isActive: boolean;
}
