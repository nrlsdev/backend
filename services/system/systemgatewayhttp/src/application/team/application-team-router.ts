import { Router } from '@backend/server';
import {
  inviteUserToTeam,
  acceptInvitation,
} from './application-team-controller';

const applicationTeamRouter: Router = Router();

applicationTeamRouter.post('/invite', inviteUserToTeam);

applicationTeamRouter.post('/accept/:invitationCode', acceptInvitation);

export { applicationTeamRouter };
