import { Subscription } from '@backend/systeminterfaces';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'Subscription',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class SubscriptionSchema implements Subscription {
  @prop({
    required: true,
    unique: false,
    type: String,
  })
  public id!: string;

  @prop({
    required: true,
    unique: false,
    type: Number,
  })
  public option!: number;

  @prop({
    required: false,
    unique: false,
    type: Number,
  })
  public expiresAt?: number;
}
