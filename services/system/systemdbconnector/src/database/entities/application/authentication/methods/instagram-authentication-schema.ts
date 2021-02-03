import { InstagramAuthentication } from '@backend/systeminterfaces';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'InstagramAuthentication',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class InstagramAuthenticationSchema implements InstagramAuthentication {
  @prop({ required: true, unique: false, default: false })
  activated!: boolean;

  @prop({ required: true, unique: false, type: String, default: '' })
  appId!: string;

  @prop({ required: true, unique: false, type: String, default: '' })
  applicationSecret!: string;
}
