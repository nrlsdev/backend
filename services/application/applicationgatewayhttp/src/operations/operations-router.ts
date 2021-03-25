import { Router } from '@backend/server';
import { dbPost, dbGet, dbPut, dbDelete, dbChangePermissions } from './operations-controller';

const operationsRouter: Router = Router();

operationsRouter.post('/', dbPost);

operationsRouter.get('/', dbGet);

operationsRouter.put('/', dbPut);

operationsRouter.delete('/', dbDelete);

operationsRouter.put('/permissions', dbChangePermissions);

export { operationsRouter };
