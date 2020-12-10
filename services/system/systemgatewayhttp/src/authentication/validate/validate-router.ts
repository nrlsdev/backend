import { Router } from '@backend/server';
import { onValidateToken } from './validate-controller';

const validationRouter: Router = Router();

validationRouter.get('/token', onValidateToken);

export { validationRouter };
