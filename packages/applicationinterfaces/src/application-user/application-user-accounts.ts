import { ApplicationUserEmailAndPasswordAccount } from './application-user-email-and-password-account';
import { ApplicationUserFacebookAccount } from './application-user-facebook-account';

export interface ApplicationUserAccounts {
  emailAndPassword?: ApplicationUserEmailAndPasswordAccount;

  facebook?: ApplicationUserFacebookAccount;
}
