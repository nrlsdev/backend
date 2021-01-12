import { ApplicationUserAuthentication } from './application-user-authentication';

export interface ApplicationUser {
  _id?: any;
  authentication: ApplicationUserAuthentication;
}
