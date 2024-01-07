import { Ref, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Users } from 'src/users/model/users.schema';

export class UserReferenceModel {
  @prop({ required: true, type: String })
  f_name: string;

  @prop({ required: true, type: String })
  l_name: string;

  @prop({ required: true, type: String })
  email: string;

  @prop({ required: true, type: String })
  phone: string;

  @prop({ required: true, type: Types.ObjectId, ref: () => Users })
  id: Ref<Users, string>;
}
