import { Router } from '@backend/server';
import {
  addPaymentInformation,
  getPaymentInformations,
  deletePaymentInformation,
} from './payment-information-controller';

const systemuserPaymentInformationRouter: Router = Router();

systemuserPaymentInformationRouter.post('/', addPaymentInformation);

systemuserPaymentInformationRouter.get('/', getPaymentInformations);

systemuserPaymentInformationRouter.post('/:cardId', deletePaymentInformation);

export { systemuserPaymentInformationRouter };
