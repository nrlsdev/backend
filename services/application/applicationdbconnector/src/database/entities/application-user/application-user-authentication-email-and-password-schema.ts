import { modelOptions, prop, Severity } from '@typegoose/typegoose';
import { ApplicationUserAuthenticationEmailAndPassword } from '@backend/applicationinterfaces';

@modelOptions({
  options: {
    customName: 'ApplicationUserAuthenticationEmailAndPassword',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class ApplicationUserAuthenticationEmailAndPasswordSchema
  implements ApplicationUserAuthenticationEmailAndPassword {
  @prop({ unique: true, required: true, _id: false })
  email!: string;

  @prop({ unique: false, required: true, _id: false })
  password!: string;
}
