import { Router } from '@backend/server';
import { publicEmailAndPasswordAuthenticationRouter } from './email-and-password/email-and-password-router';

const publicAuthenticationRouter: Router = Router();

publicAuthenticationRouter.use(
  '/emailandpassword',
  publicEmailAndPasswordAuthenticationRouter,
);

export { publicAuthenticationRouter };
