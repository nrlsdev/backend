import { Router } from '@backend/server';
import { dbPost, dbGet, dbPut, dbDelete } from './operations-controller';

const operationsRouter: Router = Router();

operationsRouter.post('/post', dbPost);

operationsRouter.post('/get', dbGet);

operationsRouter.post('/put', dbPut);

operationsRouter.post('/delete', dbDelete);

export { operationsRouter };
