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

  @prop({ required: true, type: String })
  l_name: string;

  @prop({ required: true, enum: UserTypeDocumentEnum })
  t_doc: UserTypeDocumentEnum;

  @prop({ required: true, type: String, unique: true })
  n_doc: string;

  @prop({ required: false, type: String })
  email: string;

  @prop({ required: false, type: String })
  password: string;

  @prop({ required: false, type: AddressModel })
  address: AddressModel;

  @prop({ required: false, type: String })
  phone: string;

  @prop({ required: false, type: String })
  photo: string;

  @prop({ required: false, enum: UserSexEnum })
  sex: UserSexEnum;

  @prop({ required: true, enum: UserRolesEnum, type: [String] })
  roles: Array<UserRolesEnum>;

  @prop({ required: false, type: Date })
  date_birth: Date;

  @prop({ required: true, type: Boolean, default: true })
  isActive: boolean;
}
