import { Router } from '@backend/server';
import { inviteUserToTeam } from './application-team-controller';

const applicationTeamRouter: Router = Router();

applicationTeamRouter.post('/invite', inviteUserToTeam);

export { applicationTeamRouter };
