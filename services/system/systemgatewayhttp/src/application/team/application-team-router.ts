import { Router } from '@backend/server';
import { addUserToTeam } from './application-team-controller';

const applicationTeamRouter: Router = Router();

applicationTeamRouter.post('/adduser', addUserToTeam);

export { applicationTeamRouter };
