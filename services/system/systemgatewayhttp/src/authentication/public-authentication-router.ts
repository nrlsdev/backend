import { Router } from '@backend/server';
import { signUp, signIn } from './authentication-controller';

const publicAuthenticationRouter: Router = Router();

publicAuthenticationRouter.post('/signup', signUp);

publicAuthenticationRouter.post('/signin', signIn);

export { publicAuthenticationRouter };
