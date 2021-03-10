import { Router } from '@backend/server';
import { systemuserPaymentInformationRouter } from './payment-information/payment-information-router';
import { onGetSystemuserData } from './systemuser-controller';

const systemuserRouter: Router = Router();

systemuserRouter.get('/', onGetSystemuserData);

systemuserRouter.use('/paymentinformation', systemuserPaymentInformationRouter);

export { systemuserRouter };
