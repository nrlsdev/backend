import { Router } from '@backend/server';
import {
  createApplication,
  getApplicationById,
  getAllApplicationsUserHasAuthorizationFor,
} from './application-controller';

const applicationRouter: Router = Router();

applicationRouter.post('/create', createApplication);

applicationRouter.get('/', getAllApplicationsUserHasAuthorizationFor);

applicationRouter.use('/:applicationId', getApplicationById);

export { applicationRouter };
