import { Subscriptions } from '@backend/systeminterfaces';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';
import { SubscriptionSchema } from './subscription-schema';

@modelOptions({
  options: {
    customName: 'Subscriptions',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class SubscriptionsSchema implements Subscriptions {
  @prop({
    _id: false,
    required: false,
    unique: false,
    type: SubscriptionSchema,
  })
  public active?: SubscriptionSchema;

  @prop({
    _id: false,
    required: false,
    unique: false,
    default: [],
    type: [SubscriptionSchema],
  })
  public canceled!: SubscriptionSchema[];
}
