import { Router } from '@backend/server';
import { ApplicationRole } from '@backend/systeminterfaces';
import { checkApplicationAuthorization } from '../application-authorization-checker';
import { updateGeneralInfo } from './general-controller';

const applicationGeneralRouter: Router = Router({ mergeParams: true });

applicationGeneralRouter.put(
  '/',
  checkApplicationAuthorization(ApplicationRole.ADMINISTRATOR),
  updateGeneralInfo,
);

export { applicationGeneralRouter };
