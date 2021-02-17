import { Subscription } from '@backend/systeminterfaces';
import { ApplicationSubscriptionMessage } from '@backend/systemmessagefactory';
import { Database } from '../../database/database';

export async function getActiveSubscription(applicationId: string) {
  const result = await Database.applicationEntity.getActiveSubscription(
    applicationId,
  );

  return ApplicationSubscriptionMessage.getActiveSubscriptionResponse(
    result.statusCode,
    result.subscription,
    result.error,
  );
}

export async function subscribeApplication(
  applicationId: string,
  subscription: Subscription,
) {
  const result = await Database.applicationEntity.subscribeApplication(
    applicationId,
    subscription,
  );

  return ApplicationSubscriptionMessage.subscribeApplicationResponse(
    result.statusCode,
    result.error,
  );
}
