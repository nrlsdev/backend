import { Subscription } from './subscription';

export interface Subscriptions {
  active?: Subscription;
  canceled: Subscription[];
}
