import { Request, Response, StatusCodes } from '@backend/server';
import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import {
  ErrorMessage,
  PaymentInformationMessage,
} from '@backend/systemmessagefactory';
import Stripe from 'stripe';
import { Logger } from '@backend/logger';
import { PaymentInformation } from '@backend/systeminterfaces';
import { messageManager } from '../../message-manager';
import { stripe } from '../../stripe';

const logger: Logger = new Logger('payment-information-controller');

export async function addPaymentInformation(
  request: Request,
  response: Response,
) {
  const {
    paymentInformation,
  }: {
    paymentInformation: PaymentInformation;
  } = request.body;

  if (
    !paymentInformation ||
    !paymentInformation.card ||
    !paymentInformation.card.number ||
    !paymentInformation.card.owner ||
    !paymentInformation.card.expirationMonth ||
    !paymentInformation.card.expirationYear ||
    !paymentInformation.card.cvc ||
    !paymentInformation.billingAddress ||
    !paymentInformation.billingAddress.addressLineOne ||
    !paymentInformation.billingAddress.zipCode ||
    !paymentInformation.billingAddress.city ||
    !paymentInformation.billingAddress.stateRegionProvince ||
    !paymentInformation.billingAddress.country
  ) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();

    return;
  }

  const { userId, userEmail } = request.body;
  const customerId = await getCustomerId(userId);
  let customer: Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>;

  if (!customerId) {
    try {
      customer = await stripe.customers.create({
        email: userEmail,
      });
    } catch (exception) {
      const errorResponseMessage: ResponseMessage = ErrorMessage.internalServerErrorResponse();

      logger.fatal(
        'addPaymentInformation',
        `Could not create stripe payment user: ${exception}`,
      );

      response
        .status(errorResponseMessage.meta.statusCode)
        .send(errorResponseMessage)
        .end();

      return;
    }

    const savedCustomerIdResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
      PaymentInformationMessage.setCustomerIdRequest(userId, customer.id),
      MessageQueueType.SYSTEM_DBCONNECTOR,
      MessageSeverityType.SYSTEM_USER,
    );

    if (savedCustomerIdResponseMessage.meta.statusCode !== StatusCodes.OK) {
      logger.fatal(
        'addPaymentInformation',
        `Could not save customerId in database: ${savedCustomerIdResponseMessage.body.error}`,
      );

      try {
        await stripe.customers.del(customer.id);
      } catch (exception) {
        logger.fatal(
          'addPaymentInformation',
          'Could not delete stripe customer',
        );
      }

      response
        .status(savedCustomerIdResponseMessage.meta.statusCode)
        .send(savedCustomerIdResponseMessage)
        .end();

      return;
    }
  } else {
    customer = await stripe.customers.retrieve(customerId);
  }

  let createdCardSource: Stripe.Response<Stripe.CustomerSource> | null = null;

  try {
    const createdCardToken: Stripe.Response<Stripe.Token> = await stripe.tokens.create(
      {
        card: {
          number: paymentInformation.card.number,
          name: paymentInformation.card.owner,
          exp_month: paymentInformation.card.expirationMonth,
          exp_year: paymentInformation.card.expirationYear,
          cvc: paymentInformation.card.cvc,
          address_line1: paymentInformation.billingAddress.addressLineOne,
          address_line2: paymentInformation.billingAddress.addressLineTwo,
          address_zip: paymentInformation.billingAddress.zipCode,
          address_city: paymentInformation.billingAddress.city,
          address_state: paymentInformation.billingAddress.stateRegionProvince,
          address_country: paymentInformation.billingAddress.country,
        },
      },
    );

    createdCardSource = await stripe.customers.createSource(customer.id, {
      source: createdCardToken.id,
    });
  } catch (exception) {
    logger.fatal('addPaymentInformation', exception);

    if (createdCardSource) {
      await stripe.customers.deleteSource(customer.id, createdCardSource.id);
    }

    const errorResponseMessage: ResponseMessage = ErrorMessage.errorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Could not add payment information.',
    );

    response
      .status(errorResponseMessage.meta.statusCode)
      .send(errorResponseMessage)
      .end();

    return;
  }

  const addPaymntInformationResponseMessage: ResponseMessage = PaymentInformationMessage.addPaymentInformationResponse(
    StatusCodes.OK,
  );

  response
    .status(addPaymntInformationResponseMessage.meta.statusCode)
    .send(addPaymntInformationResponseMessage)
    .end();
}

export async function getCustomerId(userId: string) {
  const customerIdResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    PaymentInformationMessage.getCustomerIdRequest(userId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_USER,
  );
  const { data }: any = customerIdResponseMessage.body;

  if (!data) {
    return undefined;
  }

  return data.customerId as string | undefined;
}
