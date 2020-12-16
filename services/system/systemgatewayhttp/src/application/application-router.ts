import { Router } from '@backend/server';
import { createApplication } from './application-controller';

const applicationRouter: Router = Router();

applicationRouter.post('/create', createApplication);

export { applicationRouter };
