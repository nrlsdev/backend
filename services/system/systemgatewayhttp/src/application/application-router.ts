import { Router } from '@backend/server';
import {
  createApplication,
  getApplicationById,
  getAllApplicationsUserHasAuthorizationFor,
} from './application-controller';
import { applicationTeamRouter } from './team/team-router';

const applicationRouter: Router = Router();

applicationRouter.post('/create', createApplication);

applicationRouter.get('/', getAllApplicationsUserHasAuthorizationFor);

applicationRouter.get('/:applicationId', getApplicationById);

applicationRouter.use('/team', applicationTeamRouter);

export { applicationRouter };
