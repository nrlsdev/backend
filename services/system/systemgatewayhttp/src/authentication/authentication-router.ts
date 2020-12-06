import { Router } from '@backend/server';
import {
  onUserSignUp,
  onUserSignIn,
  onValidateToken,
} from './authentication-controller';

const authenticationRouter: Router = Router();

authenticationRouter.post('/signup', onUserSignUp);

authenticationRouter.post('/signin', onUserSignIn);

authenticationRouter.get('/validatetoken', onValidateToken);

export { authenticationRouter };
