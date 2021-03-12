import { Router } from '@backend/server';
import { emailAndPasswordAuthenticationRouter } from './email-and-password/email-and-password-router';
import { isAuthenticated, signOut } from './authentication-controller';
import { facebookAuthenticationRouter } from './facebook/facebook-router';
import { twitterAuthenticationRouter } from './twitter/twitter-router';

const publicAuthenticationRouter: Router = Router();
const privateAuthenticationRouter: Router = Router();

publicAuthenticationRouter.use(
  '/emailandpassword',
  emailAndPasswordAuthenticationRouter,
);

publicAuthenticationRouter.use('/facebook', facebookAuthenticationRouter);

publicAuthenticationRouter.use('/twitter', twitterAuthenticationRouter);

privateAuthenticationRouter.delete('/', signOut);

privateAuthenticationRouter.get('/', isAuthenticated);

export { publicAuthenticationRouter, privateAuthenticationRouter };
