import { Router } from '@backend/server';
import {
  signUp,
  signIn,
  activateAccount,
} from './email-and-password-controller';

const publicEmailAndPasswordAuthenticationRouter: Router = Router();

publicEmailAndPasswordAuthenticationRouter.post('/signup', signUp);

publicEmailAndPasswordAuthenticationRouter.post('/signin', signIn);

publicEmailAndPasswordAuthenticationRouter.get(
  '/:activationCode',
  activateAccount,
);

export { publicEmailAndPasswordAuthenticationRouter };
