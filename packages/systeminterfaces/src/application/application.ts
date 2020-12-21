import { AuthorizedUser } from './authorized-user';

export interface Application {
  _id?: any;
  bundleId: string;
  name: string;
  image?: string;
  authorizedUsers?: AuthorizedUser[] | any;
}
