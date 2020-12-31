import { GoogleAuthentication } from '@backend/systeminterfaces';
import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'GoogleAuthentication',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class GoogleAuthenticationSchema implements GoogleAuthentication {
  @prop({ required: true, unique: false, default: false })
  activated!: boolean;

  @prop({ required: true, unique: false, type: String, default: '' })
  webClientId!: string;

  @prop({ required: true, unique: false, type: String, default: '' })
  webClientSecret!: string;
}

export const GoogleAuthenticationModel = getModelForClass(
  GoogleAuthenticationSchema,
);
