import { ApplicationUserAccounts } from '@backend/applicationinterfaces';
import { modelOptions, Severity, prop } from '@typegoose/typegoose';
import { ApplicationUserEmailAndPasswordAccountSchema } from './application-user-email-and-password-account-schema';
import { ApplicationUserFacebookAccountSchema } from './application-user-facebook-account-schema';
import { ApplicationUserTwitterAccountSchema } from './application-user-twitter-account-schema';

@modelOptions({
  options: {
    customName: 'ApplicationUserAccounts',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class ApplicationUserAccountsSchema implements ApplicationUserAccounts {
  @prop({
    unique: false,
    required: false,
    _id: false,
    type: ApplicationUserEmailAndPasswordAccountSchema,
  })
  public emailAndPassword?: ApplicationUserEmailAndPasswordAccountSchema;

  @prop({
    unique: false,
    required: false,
    _id: false,
    type: ApplicationUserFacebookAccountSchema,
  })
  public facebook?: ApplicationUserFacebookAccountSchema;

  @prop({
    unique: false,
    required: false,
    _id: false,
    type: ApplicationUserTwitterAccountSchema,
  })
  public twitter?: ApplicationUserTwitterAccountSchema;
}
