import { ResponseMessage } from '@backend/messagehandler';
import { systemAPI } from '@/utils/axios-accessor';
import { PaymentInformation } from '@backend/systeminterfaces';

export async function addPaymentInformation(
  paymentInformation: PaymentInformation,
) {
  const response = await systemAPI.post('/systemuser/paymentinformation', {
    paymentInformation,
  });
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

export async function getPaymentInformations() {
  const response = await systemAPI.get('/systemuser/paymentinformation');
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;
  const { data }: any = responseMessage.body;

  if (error) {
    return {
      error,
      paymentInformations: undefined,
    };
  }

  return {
    error: undefined,
    paymentInformations:
      (data.paymentInformations as PaymentInformation[]) || [],
  };
}

export async function deletePaymentInformation(cardId: string) {
  const response = await systemAPI.post(
    `/systemuser/paymentinformation/${cardId}`,
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

export async function setDefaultPaymentInformation(cardId: string) {
  const response = await systemAPI.put(
    `/systemuser/paymentinformation/${cardId}`,
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
