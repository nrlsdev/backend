import { Router } from '@backend/server';
import { onGetSystemuserData } from './systemuser-controller';

const systemuserRouter: Router = Router();

systemuserRouter.get('/', onGetSystemuserData);

export { systemuserRouter };
