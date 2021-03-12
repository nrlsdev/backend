import { ApplicationUserTwitterAccount } from '@backend/applicationinterfaces';
import { modelOptions, Severity, prop } from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'ApplicationUserTwitterAccount',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class ApplicationUserTwitterAccountSchema
  implements ApplicationUserTwitterAccount {
  @prop({
    unique: true,
    required: true,
    sparse: true,
  })
  public id!: string;
}
