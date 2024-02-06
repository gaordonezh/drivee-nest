import { modelOptions, plugin, prop, Severity } from '@typegoose/typegoose';
import paginationPlugin from 'typegoose-cursor-pagination';
import { UserReferenceModel } from 'src/vehicles/models/user.reference.schema';
import { VehicleReferenceModel } from './vehicle.reference.schema';

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
export class Comments {
  @prop({ required: true, type: UserReferenceModel, _id: false })
  user: UserReferenceModel;

  @prop({ required: true, type: VehicleReferenceModel, _id: false })
  vehicle: VehicleReferenceModel;

  @prop({ type: Number, required: true })
  stars: number;

  @prop({ type: String, required: true })
  title: string;

  @prop({ type: String, required: true })
  description: string;

  @prop({ type: Boolean, default: true })
  isActive: boolean;
}
