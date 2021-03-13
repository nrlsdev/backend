import { Router } from '@backend/server';
import { dbPost, dbGet, dbPut } from './operations-controller';

const operationsRouter: Router = Router();

operationsRouter.post('/', dbPost);

operationsRouter.get('/', dbGet);

operationsRouter.put('/', dbPut);
export { operationsRouter };
