import { Router } from '@backend/server';
import { inviteUserToTeam, acceptInvitation } from './team-controller';

const applicationTeamRouter: Router = Router();

applicationTeamRouter.post('/invite', inviteUserToTeam);

applicationTeamRouter.post('/accept', acceptInvitation);

export { applicationTeamRouter };
