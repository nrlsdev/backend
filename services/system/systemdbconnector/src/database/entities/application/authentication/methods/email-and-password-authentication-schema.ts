import { EmailAndPasswordAuthentication } from '@backend/systeminterfaces';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'EmailAndPasswordAuthentication',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class EmailAndPasswordAuthenticationSchema
  implements EmailAndPasswordAuthentication {
  @prop({ required: true, unique: false, default: false })
  activated!: boolean;
}
