import { modelOptions, plugin, prop, Severity } from '@typegoose/typegoose';
import paginationPlugin from 'typegoose-cursor-pagination';
import { Types } from 'mongoose';
import { DocumentStatusEnum, DocumentTypesEnum } from './documents.enum';

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
  @prop({ type: Types.ObjectId })
  idUser?: string;

  @prop({ type: Types.ObjectId })
  idVehicle?: string;

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
