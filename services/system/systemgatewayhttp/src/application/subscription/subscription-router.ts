import { Router } from '@backend/server';
import { ApplicationRole } from '@backend/systeminterfaces';
import { checkApplicationAuthorization } from '../application-authorization-checker';
import {
  getSubscriptionOptions,
  subscribeApplication,
  getApplicationSubscriptionInvoices,
  getUpcomingSubscriptionInvoice,
} from './subscription-controller';

const applicationSubscriptionRouter: Router = Router({ mergeParams: true });

applicationSubscriptionRouter.get(
  '/',
  checkApplicationAuthorization(ApplicationRole.USER),
  getSubscriptionOptions,
);

applicationSubscriptionRouter.post(
  '/:subscriptionOptionId',
  checkApplicationAuthorization(ApplicationRole.OWNER),
  subscribeApplication,
);

applicationSubscriptionRouter.get(
  '/:yearly/:subscriptionOptionId',
  checkApplicationAuthorization(ApplicationRole.OWNER),
  getUpcomingSubscriptionInvoice,
);

applicationSubscriptionRouter.get(
  '/invoices',
  checkApplicationAuthorization(ApplicationRole.OWNER),
  getApplicationSubscriptionInvoices,
);

export { applicationSubscriptionRouter };
