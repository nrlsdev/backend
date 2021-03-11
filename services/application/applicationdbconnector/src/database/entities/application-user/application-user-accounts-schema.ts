import { ApplicationUserAccounts } from '@backend/applicationinterfaces';
import { modelOptions, Severity, prop } from '@typegoose/typegoose';
import { ApplicationUserEmailAndPasswordAccountSchema } from './application-user-email-and-password-account-schema';

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
}
