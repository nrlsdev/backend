import { ResponseMessage } from '@backend/messagehandler';
import { systemAPI } from '@/utils/axios-accessor';
import { SubscriptionOption } from '@backend/systeminterfaces';

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
