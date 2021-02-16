import { RequestMessage, ResponseMessage } from '@backend/messagehandler';
import { Subscription } from '@backend/systeminterfaces';
import { SubscriptionOption } from '@backend/systeminterfaces/src/application/subscriptions/subscription-option';

export class ApplicationSubscriptionMessage {
  public static readonly TYPE_APPLICATION_SUBSCRIPTION_GET_ACTIVE_SUBSCRIPTION =
    'application_subscription_get_active_subscription';

  public static getActiveSubscriptionRequest(
    applicationId: string,
  ): RequestMessage {
    return {
      meta: {
        type:
          ApplicationSubscriptionMessage.TYPE_APPLICATION_SUBSCRIPTION_GET_ACTIVE_SUBSCRIPTION,
      },
      body: {
        data: {
          applicationId,
        },
      },
    };
  }

  public static getActiveSubscriptionResponse(
    statusCode: number,
    subscription?: Subscription,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          subscription,
        },
        error,
      },
    };
  }

  public static getSubscriptionOptions(
    subscriptionOptions: SubscriptionOption[],
    statusCode: number,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          subscriptionOptions,
        },
        error,
      },
    };
  }
}
