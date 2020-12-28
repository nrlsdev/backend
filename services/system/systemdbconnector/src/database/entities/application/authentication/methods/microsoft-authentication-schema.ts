import { MicrosoftAuthentication } from '@backend/systeminterfaces';
import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'MicrosoftAuthentication',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class MicrosoftAuthenticationSchema implements MicrosoftAuthentication {
  @prop({ required: true, unique: false, default: false })
  activated!: boolean;

  @prop({ required: true, unique: false, type: String, default: '' })
  applicationId!: string;

  @prop({ required: true, unique: false, type: String, default: '' })
  applicationSecret!: string;
}

export const MicrosoftAuthenticationModel = getModelForClass(
  MicrosoftAuthenticationSchema,
);
