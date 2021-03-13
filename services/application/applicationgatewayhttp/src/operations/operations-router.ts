import { Router } from '@backend/server';
import { dbPost } from './operations-controller';

const operationsRouter: Router = Router();

operationsRouter.post('/', dbPost);

export { operationsRouter };
