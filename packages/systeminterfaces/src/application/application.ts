import { Subscriptions } from './subscriptions/subscriptions';
import { Authentication } from './authentication/authentication';
import { AuthorizedUser } from './authorized-user';
import { InvitedUser } from './invited-user';

export interface Application {
  _id?: any;
  bundleId: string;
  name: string;
  image?: string;
  authorizedUsers?: AuthorizedUser[] | any;
  invitedUsers?: InvitedUser[] | any;
  authentication?: Authentication;
  subscriptions?: Subscriptions;
}
