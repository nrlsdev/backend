import { Authentication } from '@backend/systeminterfaces';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';
import { AuthenticationMethodsSchema } from './methods/methods-schema';

@modelOptions({
  options: {
    customName: 'Authentication',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class AuthenticationSchema implements Authentication {
  @prop({ required: true, unique: true, default: {}, _id: false })
  methods!: AuthenticationMethodsSchema;
}
