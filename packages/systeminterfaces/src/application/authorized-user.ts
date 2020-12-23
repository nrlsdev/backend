import { SystemUser } from '../system-user';

export interface AuthorizedUser {
  user: SystemUser | any;
  role: number;
}
