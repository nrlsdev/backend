import { AuthorizedUser } from '@backend/systeminterfaces';
import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
  plugin,
} from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';
import { SystemUserSchema } from '../systemuser/system-user-schema';

@modelOptions({
  options: {
    customName: 'AuthorizedUser',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
@plugin(autopopulate)
export class AuthorizedUserSchema implements AuthorizedUser {
  @prop({
    required: true,
    unique: false,
    type: SystemUserSchema,
    ref: SystemUserSchema,
    autopopulate: { select: '-password' },
  })
  user!: Ref<SystemUserSchema>;

  @prop({ required: true, unique: false })
  role!: number;
}

export const AuthorizedUserModel = getModelForClass(AuthorizedUserSchema);
