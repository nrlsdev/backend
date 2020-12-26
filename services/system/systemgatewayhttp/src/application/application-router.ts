import { Router } from '@backend/server';
import {
  createApplication,
  getAllApplicationsUserHasAuthorizationFor,
  getApplicationById,
} from './application-controller';
import { applicationTeamRouter } from './team/team-router';

const applicationRouter: Router = Router();
const authorizedApplicationRouter: Router = Router({ mergeParams: true });

applicationRouter.post('/create', createApplication);

applicationRouter.get('/all', getAllApplicationsUserHasAuthorizationFor);

authorizedApplicationRouter.get('/', getApplicationById);

authorizedApplicationRouter.use('/team', applicationTeamRouter);

applicationRouter.use('/:applicationId', authorizedApplicationRouter);

export { applicationRouter };
