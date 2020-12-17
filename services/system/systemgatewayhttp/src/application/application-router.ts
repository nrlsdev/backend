import { Router } from '@backend/server';
import {
  createApplication,
  getAllApplicationsUserHasAuthorizationFor,
  getApplicationById,
} from './application-controller';
import { applicationTeamRouter } from './team/application-team-router';

const applicationRouter: Router = Router();

applicationRouter.post('/create', createApplication);

applicationRouter.get('/', getAllApplicationsUserHasAuthorizationFor);

applicationRouter.get('/:id', getApplicationById);

applicationRouter.use('/team', applicationTeamRouter);

export { applicationRouter };
