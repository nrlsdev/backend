import { Router } from '@backend/server';
import { onUserSignUp, onUserSignIn } from './authentication-controller';

const authenticationRouter: Router = Router();

authenticationRouter.post('/signup', onUserSignUp);

authenticationRouter.post('/signin', onUserSignIn);

export { authenticationRouter };
