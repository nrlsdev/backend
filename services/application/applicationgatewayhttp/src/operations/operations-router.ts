import { Router } from '@backend/server';
import { dbPost, dbGet, dbPut, dbDelete } from './operations-controller';

const operationsRouter: Router = Router();

operationsRouter.post('/', dbPost);

operationsRouter.get('/', dbGet);

operationsRouter.put('/', dbPut);

operationsRouter.delete('/', dbDelete);

export { operationsRouter };
