import { FacebookAuthentication } from '@backend/systeminterfaces';
import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'FacebookAuthentication',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class FacebookAuthenticationSchema implements FacebookAuthentication {
  @prop({ required: true, unique: false, default: false })
  activated!: boolean;

  @prop({ required: true, unique: false, type: String, default: '' })
  appId!: string;

  @prop({ required: true, unique: false, type: String, default: '' })
  applicationSecret!: string;
}

export const FacebookAuthenticationModel = getModelForClass(
  FacebookAuthenticationSchema,
);
