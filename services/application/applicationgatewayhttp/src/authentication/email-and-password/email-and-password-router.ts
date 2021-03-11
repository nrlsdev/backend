import { Router } from '@backend/server';
import { signup, activateAccount } from './email-and-password-controller';

const publicEmailAndPasswordAuthenticationRouter: Router = Router();

publicEmailAndPasswordAuthenticationRouter.post('/signup', signup);

publicEmailAndPasswordAuthenticationRouter.get(
  '/:activationCode',
  activateAccount,
);

export { publicEmailAndPasswordAuthenticationRouter };
