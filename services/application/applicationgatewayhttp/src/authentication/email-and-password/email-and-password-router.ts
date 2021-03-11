import { Router } from '@backend/server';
import { signup } from './email-and-password-controller';

const publicEmailAndPasswordAuthenticationRouter: Router = Router();

publicEmailAndPasswordAuthenticationRouter.post('/signup', signup);

export { publicEmailAndPasswordAuthenticationRouter };
