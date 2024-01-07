import { modelOptions, plugin, prop, Ref, Severity } from '@typegoose/typegoose';
import paginationPlugin from 'typegoose-cursor-pagination';
import { Types } from 'mongoose';
import { DocumentStatusEnum, DocumentTypesEnum } from './documents.enum';
import { Users } from 'src/users/model/users.schema';
import { Vehicles } from 'src/vehicles/models/vehicle.schema';

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
export class Documents {
  @prop({ type: Types.ObjectId, ref: () => Users })
  user?: Ref<Users, string>;

  @prop({ type: Types.ObjectId, ref: () => Vehicles })
  vehicle?: string;

  @prop({ required: true, enum: DocumentTypesEnum })
  type: DocumentTypesEnum;

  @prop({ required: true, type: String })
  url: string;

  @prop({ required: true, enum: DocumentStatusEnum, default: DocumentStatusEnum.REVIEW })
  status: DocumentStatusEnum;

  @prop({ type: String })
  comment?: string;

  @prop({ type: Boolean, default: true })
  isActive: boolean;
}
