import { AppleAuthentication } from '@backend/systeminterfaces';
import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'AppleAuthentication',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class AppleAuthenticationSchema implements AppleAuthentication {
  @prop({ required: true, unique: false, default: false })
  activated!: boolean;

  @prop({
    required: true,
    unique: false,
    type: String,
    default: '',
  })
  servicesId!: string;

  @prop({ required: true, unique: false, type: String, default: '' })
  appleTeamId!: string;

  @prop({ required: true, unique: false, type: String, default: '' })
  keyId!: string;

  @prop({ required: true, unique: false, type: String, default: '' })
  privateKey!: string;
}

export const AppleAuthenticationModel = getModelForClass(
  AppleAuthenticationSchema,
);
