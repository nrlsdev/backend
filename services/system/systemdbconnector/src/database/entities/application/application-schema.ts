import { Application } from '@backend/systeminterfaces';
import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'Application',
    allowMixed: Severity.ALLOW,
  },
})
export class ApplicationSchema implements Application {
  @prop({ required: true, unique: true })
  bundleId!: string;

  @prop({ required: true, unique: false })
  name!: string;

  @prop({ required: false, unique: false })
  image?: string;
}

export const ApplicationModel = getModelForClass(ApplicationSchema);
