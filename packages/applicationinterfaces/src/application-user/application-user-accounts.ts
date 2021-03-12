import { ApplicationUserEmailAndPasswordAccount } from './application-user-email-and-password-account';
import { ApplicationUserFacebookAccount } from './application-user-facebook-account';
import { ApplicationUserTwitterAccount } from './application-user-twitter-account';

export interface ApplicationUserAccounts {
  emailAndPassword?: ApplicationUserEmailAndPasswordAccount;

  facebook?: ApplicationUserFacebookAccount;

  twitter?: ApplicationUserTwitterAccount;
}
