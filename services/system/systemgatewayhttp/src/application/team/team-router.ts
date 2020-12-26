import { Router } from '@backend/server';
import {
  inviteUserToTeam,
  acceptInvitation,
  deleteInvitation,
  updateAuthorizedUser,
} from './team-controller';

const applicationTeamRouter: Router = Router({ mergeParams: true });

applicationTeamRouter.post('/invite', inviteUserToTeam);

applicationTeamRouter.delete('/invite/:userId', deleteInvitation);

applicationTeamRouter.put('/:userId', updateAuthorizedUser);

applicationTeamRouter.post('/accept', acceptInvitation);

export { applicationTeamRouter };
