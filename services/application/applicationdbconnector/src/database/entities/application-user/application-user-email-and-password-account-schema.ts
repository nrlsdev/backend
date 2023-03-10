import { ApplicationUserEmailAndPasswordAccount } from '@backend/applicationinterfaces';
import { modelOptions, Severity, prop } from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'ApplicationUserEmailAndPasswordAccount',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class ApplicationUserEmailAndPasswordAccountSchema
  implements ApplicationUserEmailAndPasswordAccount {
  @prop({
    unique: true,
    required: true,
    sparse: true,
  })
  public email!: string;

  @prop({
    unique: false,
    required: true,
  })
  public password!: string;

  @prop({
    unique: false,
    required: false,
  })
  public activationCode?: string;

  @prop({
    unique: false,
    required: true,
  })
  public activated!: boolean;
}
