import { Router } from '@backend/server';
import { signOut, isAuthenticated } from './authentication-controller';

const privateAuthenticationRouter: Router = Router();

privateAuthenticationRouter.post('/signout', signOut);

privateAuthenticationRouter.get('/', isAuthenticated);

export { privateAuthenticationRouter };
