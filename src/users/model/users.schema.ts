import { modelOptions, plugin, prop, Severity } from '@typegoose/typegoose';
import paginationPlugin from 'typegoose-cursor-pagination';
import { AddressModel } from './address.schema';
import { UserTypeDocumentEnum } from '../enum/userTypeDocument.enum';
import { UserSexEnum } from '../enum/userSex.enum';
import { UserRolesEnum } from '../enum/userRoles.enum';

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
export class Users {
  @prop({ required: true, type: String })
  f_name: string;

  @prop({ type: String })
  l_name: string;

  @prop({ required: true, type: String, unique: true })
  email: string;

  @prop({ type: String })
  phone: string;

  @prop({ enum: UserTypeDocumentEnum })
  t_doc: UserTypeDocumentEnum;

  @prop({ type: String })
  n_doc: string;

  @prop({ enum: UserSexEnum })
  sex: UserSexEnum;

  @prop({ type: AddressModel, _id: false })
  address: AddressModel;

  @prop({ required: true, enum: UserRolesEnum, type: [String] })
  roles: Array<UserRolesEnum>;

  @prop({ type: String })
  password: string;

  @prop({ type: Date })
  date_birth: Date;

  @prop({ type: String })
  photo: string;

  @prop({ type: Boolean, default: true })
  isActive: boolean;

  @prop({ type: Boolean, default: false })
  isVerified: boolean;
}
