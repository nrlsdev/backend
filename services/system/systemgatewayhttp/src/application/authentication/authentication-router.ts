import { Router } from '@backend/server';
import { ApplicationRole } from '@backend/systeminterfaces';
import { checkApplicationAuthorization } from '../application-authorization-checker';
import { updateAuthenticationMethod } from './authentication-controller';

const applicationAuthenticationRouter: Router = Router({ mergeParams: true });

applicationAuthenticationRouter.put(
  '/',
  checkApplicationAuthorization(ApplicationRole.ADMINISTRATOR),
  updateAuthenticationMethod,
);

export { applicationAuthenticationRouter };
