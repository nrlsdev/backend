import { Router } from '@backend/server';
import {
  onUserSignUp,
  onUserSignIn,
  onRefreshToken,
} from './authentication-controller';

const authenticationRouter: Router = Router();

authenticationRouter.post('/signup', onUserSignUp);

authenticationRouter.post('/signin', onUserSignIn);

authenticationRouter.get('/refreshtoken', onRefreshToken);

export { authenticationRouter };