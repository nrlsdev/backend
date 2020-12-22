import { Router } from '@backend/server';
import {
  inviteUserToTeam,
  acceptInvitation,
  deleteInvitation,
} from './team-controller';

const applicationTeamRouter: Router = Router();

applicationTeamRouter.post('/invite', inviteUserToTeam);

applicationTeamRouter.delete(
  '/invite/:applicationId/:userId',
  deleteInvitation,
);

applicationTeamRouter.post('/accept', acceptInvitation);

export { applicationTeamRouter };
