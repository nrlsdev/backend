import { ApplicationRole, InvitedUser } from '@backend/systeminterfaces';
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
    customName: 'InvitedUser',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
@plugin(autopopulate)
export class InvitedUserSchema implements InvitedUser {
  @prop({
    required: true,
    unique: false,
    type: SystemUserSchema,
    ref: SystemUserSchema,
    autopopulate: true,
  })
  user!: Ref<SystemUserSchema>;

  @prop({ required: true, unique: false, enum: ApplicationRole })
  role!: ApplicationRole;

  @prop({ required: true, unique: false })
  invitationCode!: string;
}

export const InvitedUserModel = getModelForClass(InvitedUserSchema);
