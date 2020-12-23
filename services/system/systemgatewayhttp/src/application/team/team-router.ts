import { Router } from '@backend/server';
import {
  inviteUserToTeam,
  acceptInvitation,
  deleteInvitation,
  updateAuthorizedUser,
} from './team-controller';

const applicationTeamRouter: Router = Router();

applicationTeamRouter.post('/invite', inviteUserToTeam);

applicationTeamRouter.delete(
  '/invite/:applicationId/:userId',
  deleteInvitation,
);

applicationTeamRouter.put('/:applicationId/:userId', updateAuthorizedUser);

applicationTeamRouter.post('/accept', acceptInvitation);

export { applicationTeamRouter };
