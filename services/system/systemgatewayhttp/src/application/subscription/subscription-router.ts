import { Router } from '@backend/server';
import { ApplicationRole } from '@backend/systeminterfaces';
import { checkApplicationAuthorization } from '../application-authorization-checker';
import { getSubscriptionOptions } from './subscription-controller';

const applicationSubscriptionRouter: Router = Router({ mergeParams: true });

applicationSubscriptionRouter.get(
  '/',
  checkApplicationAuthorization(ApplicationRole.USER),
  getSubscriptionOptions,
);

export { applicationSubscriptionRouter };
