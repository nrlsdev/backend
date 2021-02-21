import { ResponseMessage } from '@backend/messagehandler';
import { systemAPI } from '@/utils/axios-accessor';
import {
  SubscriptionLineItem,
  SubscriptionOption,
} from '@backend/systeminterfaces';

export async function getApplicationSubscriptionOptions(applicationId: string) {
  const response = await systemAPI.get(
    `/application/${applicationId}/subscription`,
  );
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;
  const { data }: any = responseMessage.body;

  if (error) {
    return {
      error,
      subscriptionOptions: undefined,
    };
  }

  return {
    error: undefined,
    subscriptionOptions:
      (data.subscriptionOptions as SubscriptionOption[]) || [],
  };
}

export async function cancelSubscription(
  applicationId: string,
  subscriptionId: string,
) {
  const response = await systemAPI.put(
    `/application/${applicationId}/subscription`,
    {
      subscriptionId,
    },
  );
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error) {
    return {
      error,
    };
  }

  return {
    error: undefined,
  };
}

export async function subscribeApplication(
  applicationId: string,
  subscriptionOptionId: number,
  yearly: boolean,
  paymentMethodId: string,
) {
  const response = await systemAPI.post(
    `/application/${applicationId}/subscription/${subscriptionOptionId}`,
    {
      yearly,
      paymentMethodId,
    },
  );
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error) {
    return {
      error,
    };
  }

  return {
    error: undefined,
  };
}

export async function changeSubscription(
  applicationId: string,
  subscriptionOptionId: number,
  paymentMethodId: string,
  yearly: boolean,
) {
  const response = await systemAPI.put(
    `/application/${applicationId}/subscription/change/${subscriptionOptionId}`,
    {
      paymentMethodId,
      yearly,
    },
  );
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error) {
    return {
      error,
    };
  }

  return {
    error: undefined,
  };
}

export async function getUpcomingSubscriptionInvoice(
  applicationId: string,
  subscriptionOptionId: number,
  yearly: boolean,
) {
  const response = await systemAPI.get(
    `/application/${applicationId}/subscription/${yearly}/${subscriptionOptionId}`,
  );
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;
  const { data }: any = responseMessage.body;

  if (error) {
    return {
      error,
      total: undefined,
      subscriptionLineItems: [],
    };
  }

  return {
    error: undefined,
    total: data.total as number,
    subscriptionLineItems: data.subscriptionLineItems as SubscriptionLineItem[],
  };
}
