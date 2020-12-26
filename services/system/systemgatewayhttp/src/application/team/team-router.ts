import { Router } from '@backend/server';
import { ApplicationRole } from '@backend/systeminterfaces';
import { checkApplicationAuthorization } from '../application-authorization-checker';
import {
  inviteUserToTeam,
  acceptInvitation,
  deleteInvitation,
  updateAuthorizedUser,
} from './team-controller';

const applicationTeamRouter: Router = Router({ mergeParams: true });

applicationTeamRouter.post(
  '/invite',
  checkApplicationAuthorization(ApplicationRole.ADMINISTRATOR),
  inviteUserToTeam,
);

applicationTeamRouter.delete(
  '/invite/:userId',
  checkApplicationAuthorization(ApplicationRole.ADMINISTRATOR),
  deleteInvitation,
);

applicationTeamRouter.put(
  '/:userId',
  checkApplicationAuthorization(ApplicationRole.ADMINISTRATOR),
  updateAuthorizedUser,
);

applicationTeamRouter.post('/accept', acceptInvitation);

export { applicationTeamRouter };
