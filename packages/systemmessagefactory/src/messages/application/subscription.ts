import { RequestMessage, ResponseMessage } from '@backend/messagehandler';
import {
  Subscription,
  SubscriptionOption,
  SubscriptionInvoice,
  SubscriptionLineItem,
} from '@backend/systeminterfaces';

export class ApplicationSubscriptionMessage {
  public static readonly TYPE_APPLICATION_SUBSCRIPTION_GET_ACTIVE_SUBSCRIPTION =
    'application_subscription_get_active_subscription';

  public static readonly TYPE_APPLICATION_SUBSCRIPTION_SUBSCRIBE_APPLICATION =
    'application_subscription_subscribe_application';

  public static readonly TYPE_APPLICATION_SUBSCRIPTION_GET_ALL_APPLICATION_SUBSCRIPTION_IDS =
    'application_subscription_get_all_application_subscription_ids';

  public static readonly TYPE_APPLICATION_SUBSCRIPTION_CANCEL_SUBSCRIPTION =
    'application_subscription_cancel_subscription';

  public static readonly TYPE_APPLICATION_SUBSCRIPTION_CHANGE_SUBSCRIPTION =
    'application_subscription_change_subscription';

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

  public static getAllApplicationSubscriptionIdsRequest(
    applicationId: string,
  ): RequestMessage {
    return {
      meta: {
        type:
          ApplicationSubscriptionMessage.TYPE_APPLICATION_SUBSCRIPTION_GET_ALL_APPLICATION_SUBSCRIPTION_IDS,
      },
      body: {
        data: {
          applicationId,
        },
      },
    };
  }

  public static getAllApplicationSubscriptionIdsResponse(
    subscriptionIds: string[],
    statusCode: number,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          subscriptionIds,
        },
        error,
      },
    };
  }

  public static getApplicationSubscriptionInvoicesResponse(
    subscriptionInvoices: SubscriptionInvoice[],
    statusCode: number,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          subscriptionInvoices,
        },
        error,
      },
    };
  }

  public static getApplicationSubscriptionNextInvoicePriceResponse(
    total: number,
    subscriptionLineItems: SubscriptionLineItem[],
    statusCode: number,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          total,
          subscriptionLineItems,
        },
        error,
      },
    };
  }

  public static cancelSubscriptionRequest(
    applicationId: string,
    expiresAt: number,
  ): RequestMessage {
    return {
      meta: {
        type:
          ApplicationSubscriptionMessage.TYPE_APPLICATION_SUBSCRIPTION_CANCEL_SUBSCRIPTION,
      },
      body: {
        data: {
          applicationId,
          expiresAt,
        },
      },
    };
  }

  public static cancelSubscriptionResponse(
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

  public static changeSubscriptionResponse(
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

  public static changeSubscriptionRequest(
    applicationId: string,
    subscriptionOptionId: number,
  ): RequestMessage {
    return {
      meta: {
        type:
          ApplicationSubscriptionMessage.TYPE_APPLICATION_SUBSCRIPTION_CHANGE_SUBSCRIPTION,
      },
      body: {
        data: {
          applicationId,
          subscriptionOptionId,
        },
      },
    };
  }
}
