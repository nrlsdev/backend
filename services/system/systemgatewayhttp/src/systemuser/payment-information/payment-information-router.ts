import { Router } from '@backend/server';
import { addPaymentInformation } from './payment-information-controller';

const systemuserPaymentInformationRouter: Router = Router();

systemuserPaymentInformationRouter.post('/', addPaymentInformation);

export { systemuserPaymentInformationRouter };
