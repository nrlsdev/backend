import { RequestMessage, ResponseMessage } from '@backend/messagehandler';
import { Subscription } from '@backend/systeminterfaces';
import { SubscriptionOption } from '@backend/systeminterfaces/src/application/subscriptions/subscription-option';

export class ApplicationSubscriptionMessage {
  public static readonly TYPE_APPLICATION_SUBSCRIPTION_GET_ACTIVE_SUBSCRIPTION =
    'application_subscription_get_active_subscription';

  public static readonly TYPE_APPLICATION_SUBSCRIPTION_SUBSCRIBE_APPLICATION =
    'application_subscription_subscribe_application';

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

  public static getSubscriptionOptionsResponse(
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

  public static subscribeApplicationRequest(
    applicationId: string,
    subscription: Subscription,
  ): RequestMessage {
    return {
      meta: {
        type:
          ApplicationSubscriptionMessage.TYPE_APPLICATION_SUBSCRIPTION_SUBSCRIBE_APPLICATION,
      },
      body: {
        data: {
          applicationId,
          subscription,
        },
      },
    };
  }

  public static subscribeApplicationResponse(
    statusCode: number,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        error,
      },
    };
  }
}
