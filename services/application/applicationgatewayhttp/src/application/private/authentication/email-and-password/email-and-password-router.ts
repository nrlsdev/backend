import { Router } from '@backend/server';
import {
  emailAndPasswordSignUp,
  emailAndPasswordSignIn,
} from './email-and-password-controller';

const emailAndPasswordRouter: Router = Router();

emailAndPasswordRouter.post('/signup', emailAndPasswordSignUp);

emailAndPasswordRouter.post('/signin', emailAndPasswordSignIn);

export { emailAndPasswordRouter };
