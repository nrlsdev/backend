import { Router } from '@backend/server';
import { emailAndPasswordRouter } from './email-and-password/email-and-password-router';

const authenticationRouter: Router = Router();

authenticationRouter.use('emailandpassword', emailAndPasswordRouter);

export { authenticationRouter };
