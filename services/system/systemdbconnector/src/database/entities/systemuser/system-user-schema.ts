import { SystemUser } from '@backend/systeminterfaces';
import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'SystemUser',
    allowMixed: Severity.ALLOW,
  },
})
export class SystemUserSchema implements SystemUser {
  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true, unique: false })
  public firstname!: string;

  @prop({ required: true, unique: false })
  public lastname!: string;

  @prop({ required: true, unique: false })
  public password!: string;
}

export const SystemUserModel = getModelForClass(SystemUserSchema);
