import { Router } from '@backend/server';
import {
  createApplication,
  getAllApplicationsUserHasAuthorizationFor,
} from './application-controller';

const applicationRouter: Router = Router();

applicationRouter.post('/create', createApplication);

applicationRouter.get('/', getAllApplicationsUserHasAuthorizationFor);

export { applicationRouter };
