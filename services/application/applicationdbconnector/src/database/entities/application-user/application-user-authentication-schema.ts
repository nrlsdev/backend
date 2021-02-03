import { modelOptions, prop, Severity } from '@typegoose/typegoose';
import {
  ApplicationUserAuthentication,
  ApplicationUserAuthenticationEmailAndPassword,
} from '@backend/applicationinterfaces';

@modelOptions({
  options: {
    customName: 'ApplicationUserAuthentication',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class ApplicationUserAuthenticationSchema
  implements ApplicationUserAuthentication {
  @prop({ unique: false, required: true, default: {}, _id: false })
  emailAndPassword!: ApplicationUserAuthenticationEmailAndPassword;
}
