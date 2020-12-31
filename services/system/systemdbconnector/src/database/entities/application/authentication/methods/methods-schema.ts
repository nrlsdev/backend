import { AuthenticationMethods } from '@backend/systeminterfaces';
import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { AppleAuthenticationSchema } from './apple-authentication-schema';
import { EmailAndPasswordAuthenticationSchema } from './email-and-password-authentication-schema';
import { FacebookAuthenticationSchema } from './facebook-authentication-schema';
import { GoogleAuthenticationSchema } from './google-authentication-schema';
import { InstagramAuthenticationSchema } from './instagram-authentication-schema';
import { MicrosoftAuthenticationSchema } from './microsoft-authentication-schema';
import { TwitterAuthenticationSchema } from './twitter-authentication-schema';

@modelOptions({
  options: {
    customName: 'AuthenticationMethods',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class AuthenticationMethodsSchema implements AuthenticationMethods {
  @prop({ required: true, unique: true, default: {}, _id: false })
  emailAndPassword!: EmailAndPasswordAuthenticationSchema;

  @prop({ required: true, unique: true, default: {}, _id: false })
  apple!: AppleAuthenticationSchema;

  @prop({ required: true, unique: true, default: {}, _id: false })
  google!: GoogleAuthenticationSchema;

  @prop({ required: true, unique: true, default: {}, _id: false })
  microsoft!: MicrosoftAuthenticationSchema;

  @prop({ required: true, unique: true, default: {}, _id: false })
  facebook!: FacebookAuthenticationSchema;

  @prop({ required: true, unique: true, default: {}, _id: false })
  instagram!: InstagramAuthenticationSchema;

  @prop({ required: true, unique: true, default: {}, _id: false })
  twitter!: TwitterAuthenticationSchema;
}

export const AuthenticationMethodsModel = getModelForClass(
  AuthenticationMethodsSchema,
);
