import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class PaymentInformationMessage {
  public static readonly TYPE_PAYMENT_INFORMATION_GET_CUSTOMER_ID =
    'payment_information_get_customer_id';

  public static readonly TYPE_PAYMENT_INFORMATION_SET_CUSTOMER_ID =
    'payment_information_set_customer_id';

  // get customer id
  public static getCustomerIdRequest(userId: string): RequestMessage {
    return {
      meta: {
        type:
          PaymentInformationMessage.TYPE_PAYMENT_INFORMATION_GET_CUSTOMER_ID,
      },
      body: {
        data: {
          userId,
        },
      },
    };
  }

  public static getCustomerIdResponse(
    statusCode: number,
    customerId?: string,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          customerId,
        },
        error,
      },
    };
  }

  // set customer id
  public static setCustomerIdRequest(
    userId: string,
    customerId: string,
  ): RequestMessage {
    return {
      meta: {
        type:
          PaymentInformationMessage.TYPE_PAYMENT_INFORMATION_SET_CUSTOMER_ID,
      },
      body: {
        data: {
          userId,
          customerId,
        },
      },
    };
  }

  public static setCustomerIdResponse(
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

  // add payment information
  public static addPaymentInformationResponse(
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
