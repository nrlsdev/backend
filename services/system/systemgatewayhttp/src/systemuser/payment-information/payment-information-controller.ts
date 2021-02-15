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

export async function getPaymentInformations(
  request: Request,
  response: Response,
) {
  const { userId } = request.body;
  const customerId = await getCustomerId(userId);

  if (!customerId) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.errorResponse(
      StatusCodes.NOT_FOUND,
      'Could not find payment informations.',
    );

    response
      .status(errorResponseMessage.meta.statusCode)
      .send(errorResponseMessage)
      .end();

    return;
  }

  const sources: Stripe.Response<
    Stripe.ApiList<Stripe.CustomerSource>
  > = await stripe.customers.listSources(customerId);
  const customer: Stripe.Customer = (await stripe.customers.retrieve(
    customerId,
  )) as Stripe.Customer;
  const defaultSourceId: string = customer.default_source as string;

  if (!sources || !sources.data) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.errorResponse(
      StatusCodes.NOT_FOUND,
      'Could not find payment informations.',
    );

    response
      .status(errorResponseMessage.meta.statusCode)
      .send(errorResponseMessage)
      .end();

    return;
  }

  const paymentInformations: PaymentInformation[] = [];

  for (let i = 0; i < sources.data.length; i += 1) {
    const source: Stripe.Card = sources.data[i] as Stripe.Card;
    const paymentInformation: PaymentInformation = {
      card: {
        id: source.id,
        last4: source.last4,
        brand: source.brand,
        owner: source.name || '',
        expirationMonth: source.exp_month.toString() || '',
        expirationYear: source.exp_year.toString() || '',
        default: defaultSourceId === source.id,
      },
      billingAddress: {
        addressLineOne: source.address_line1 || '',
        addressLineTwo: source.address_line2 || '',
        zipCode: source.address_zip || '',
        city: source.address_city || '',
        stateRegionProvince: source.address_state || '',
        country: source.address_country || '',
      },
    };

    paymentInformations.push(paymentInformation);
  }

  const responseMessage: ResponseMessage = PaymentInformationMessage.getPaymentInformations(
    paymentInformations,
    StatusCodes.OK,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
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
