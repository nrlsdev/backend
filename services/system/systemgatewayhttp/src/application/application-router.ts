import { Router } from '@backend/server';
import { ApplicationRole } from '../../../../../packages/systemmessagefactory/node_modules/@backend/systeminterfaces';
import { checkApplicationAuthorization } from './application-authorization-checker';
import {
  createApplication,
  getAllApplicationsUserHasAuthorizationFor,
  getApplicationById,
} from './application-controller';
import { applicationTeamRouter } from './team/team-router';
import { applicationGeneralRouter } from './general/general-router';

const applicationRouter: Router = Router();
const authorizedApplicationRouter: Router = Router({ mergeParams: true });

applicationRouter.post('/create', createApplication);

applicationRouter.get('/all', getAllApplicationsUserHasAuthorizationFor);

authorizedApplicationRouter.get(
  '/',
  checkApplicationAuthorization(ApplicationRole.USER),
  getApplicationById,
);

authorizedApplicationRouter.use('/team', applicationTeamRouter);

authorizedApplicationRouter.use('/general', applicationGeneralRouter);

applicationRouter.use('/:applicationId', authorizedApplicationRouter);

export { applicationRouter };
