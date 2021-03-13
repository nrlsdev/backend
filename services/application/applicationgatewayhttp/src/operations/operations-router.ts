import { Router } from '@backend/server';
import { dbPost, dbGet } from './operations-controller';

const operationsRouter: Router = Router();

operationsRouter.post('/', dbPost);

operationsRouter.get('/', dbGet);
export { operationsRouter };
