import { TwitterAuthentication } from '@backend/systeminterfaces';
import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'TwitterAuthentication',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class TwitterAuthenticationSchema implements TwitterAuthentication {
  @prop({ required: true, unique: false, default: false })
  activated!: boolean;

  @prop({ required: true, unique: false, type: String, default: '' })
  apiKey!: string;

  @prop({ required: true, unique: false, type: String, default: '' })
  apiSecret!: string;
}

export const TwitterAuthenticationModel = getModelForClass(
  TwitterAuthenticationSchema,
);
