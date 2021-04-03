import { Router } from '@backend/server';
import { dbPost, dbGet, dbPut, dbDelete, dbChangePermissions } from './operations-controller';

const operationsRouter: Router = Router();

operationsRouter.post('/post', dbPost);

operationsRouter.post('/get', dbGet);

operationsRouter.post('/put', dbPut);

operationsRouter.post('/delete', dbDelete);

operationsRouter.put('/permissions', dbChangePermissions);

export { operationsRouter };
