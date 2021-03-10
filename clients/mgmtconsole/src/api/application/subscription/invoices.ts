import { systemAPI } from '@/utils/axios-accessor';
import { ResponseMessage } from '@backend/messagehandler';
import { SubscriptionInvoice } from '@backend/systeminterfaces';

export async function getAllSubscriptionInvoices(applicationId: string) {
  const response = await systemAPI.get(
    `/application/${applicationId}/subscription/invoices`,
  );
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;
  const { data }: any = responseMessage.body;

  if (error) {
    return {
      error,
      invoices: [],
    };
  }

  return {
    error: undefined,
    invoices: data.subscriptionInvoices as SubscriptionInvoice[],
  };
}
