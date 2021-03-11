import { Router } from '@backend/server';
import { publicEmailAndPasswordAuthenticationRouter } from './email-and-password/email-and-password-router';
import { isAuthenticated, signOut } from './authentication-controller';

const publicAuthenticationRouter: Router = Router();
const privateAuthenticationRouter: Router = Router();

publicAuthenticationRouter.use(
  '/emailandpassword',
  publicEmailAndPasswordAuthenticationRouter,
);

privateAuthenticationRouter.delete('/', signOut);

privateAuthenticationRouter.get('/', isAuthenticated);

export { publicAuthenticationRouter, privateAuthenticationRouter };
