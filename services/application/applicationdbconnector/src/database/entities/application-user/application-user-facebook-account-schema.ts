import { ApplicationUserFacebookAccount } from '@backend/applicationinterfaces';
import { modelOptions, Severity, prop } from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'ApplicationUserFacebookAccount',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class ApplicationUserFacebookAccountSchema
  implements ApplicationUserFacebookAccount {
  @prop({
    unique: true,
    required: true,
  })
  public id!: string;
}
