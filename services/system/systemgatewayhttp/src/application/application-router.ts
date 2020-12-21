import { Router } from '@backend/server';
import {
  createApplication,
  getAllApplicationsUserHasAuthorizationFor,
  getApplicationById,
} from './application-controller';

const applicationRouter: Router = Router();

applicationRouter.post('/create', createApplication);

applicationRouter.get('/', getAllApplicationsUserHasAuthorizationFor);

applicationRouter.get('/:id', getApplicationById);

export { applicationRouter };
