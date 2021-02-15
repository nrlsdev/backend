import { Router } from '@backend/server';
import {
  addPaymentInformation,
  getPaymentInformations,
} from './payment-information-controller';

const systemuserPaymentInformationRouter: Router = Router();

systemuserPaymentInformationRouter.post('/', addPaymentInformation);

systemuserPaymentInformationRouter.get('/', getPaymentInformations);

export { systemuserPaymentInformationRouter };
