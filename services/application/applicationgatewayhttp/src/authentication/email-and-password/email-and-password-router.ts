import { Router } from '@backend/server';
import {
  signUp,
  signIn,
  activateAccount,
} from './email-and-password-controller';

const emailAndPasswordAuthenticationRouter: Router = Router();

emailAndPasswordAuthenticationRouter.post('/signup', signUp);

emailAndPasswordAuthenticationRouter.post('/signin', signIn);

emailAndPasswordAuthenticationRouter.get('/:activationCode', activateAccount);

export { emailAndPasswordAuthenticationRouter };
