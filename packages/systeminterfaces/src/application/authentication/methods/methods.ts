import {
  EmailAndPasswordAuthentication,
  AppleAuthentication,
  GoogleAuthentication,
  MicrosoftAuthentication,
  FacebookAuthentication,
  InstagramAuthentication,
  TwitterAuthentication,
} from '../../../..';

export interface AuthenticationMethods {
  emailAndPassword?: EmailAndPasswordAuthentication;
  apple?: AppleAuthentication;
  google?: GoogleAuthentication;
  microsoft?: MicrosoftAuthentication;
  facebook?: FacebookAuthentication;
  instagram?: InstagramAuthentication;
  twitter?: TwitterAuthentication;
}
