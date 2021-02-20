import {
  ResponseMessage,
  MessageQueueType,
  MessageSeverityType,
} from '@backend/messagehandler';
import { Request, Response, StatusCodes } from '@backend/server';
import {
  ApplicationSubscriptionMessage,
  ErrorMessage,
} from '@backend/systemmessagefactory';
import {
  copyObject,
  SubscriptionOption,
  Subscription,
  SubscriptionInvoice,
} from '@backend/systeminterfaces';
import { Logger } from '@backend/logger';
import { SystemConfiguration } from '@backend/systemconfiguration';
import Stripe from 'stripe';
import { messageManager } from '../../message-manager';
import { stripe } from '../../stripe';
import { getCustomerId } from '../../systemuser/payment-information/payment-information-controller';

const logger: Logger = new Logger('subscriptions-controller');
const { subscriptions } = SystemConfiguration;

export async function getSubscriptionOptions(
  request: Request,
  response: Response,
) {
  if (!subscriptions) {
    logger.fatal('getSubscriptionOptions', 'No subscription options found!');

    const successResponseMessage: ResponseMessage = ErrorMessage.internalServerErrorResponse();

    response
      .status(successResponseMessage.meta.statusCode)
      .send(successResponseMessage)
      .end();

    return;
  }

  const { applicationId } = request.params;
  const subscriptionIdResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.getActiveSubscriptionRequest(applicationId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );
  const { data }: any = subscriptionIdResponseMessage.body;
  const activeSubscription: Subscription | null = data
    ? data.subscription || null
    : null;
  const subscriptionOptions: SubscriptionOption[] = [];
  const activeStripeSubscription = activeSubscription
    ? await stripe.subscriptions.retrieve(activeSubscription!.id)
    : null;

  for (let i = 0; i < subscriptions.length; i += 1) {
    const subscription: SubscriptionOption = subscriptions[i];
    const subscriptionOption: SubscriptionOption = copyObject(subscription);

    // eslint-disable-next-line no-await-in-loop
    const priceMonth = await stripe.prices.retrieve(
      subscriptionOption.priceMonthId!,
    );

    // eslint-disable-next-line no-await-in-loop
    const priceYear = await stripe.prices.retrieve(
      subscriptionOption.priceYearId!,
    );

    delete subscriptionOption.priceMonthId;
    delete subscriptionOption.priceYearId;

    subscriptionOption.id = Number(subscriptionOption.id);
    subscriptionOption.readRequests = Number(subscriptionOption.readRequests);
    subscriptionOption.writeRequests = Number(subscriptionOption.writeRequests);
    subscriptionOption.dataStorageInGB = Number(
      subscriptionOption.dataStorageInGB,
    );
    subscriptionOption.trial = Boolean(subscriptionOption.trial);
    subscriptionOption.priceMonth = Number(priceMonth.unit_amount_decimal);
    subscriptionOption.priceYear = Number(priceYear.unit_amount_decimal);
    subscriptionOption.active = activeSubscription
      ? Number(subscriptionOption.id) === Number(activeSubscription.option)
      : false;
    if (subscriptionOption.active) {
      subscriptionOption.startDate = activeStripeSubscription
        ? activeStripeSubscription.start_date || -1
        : -1;
      subscriptionOption.currentPeriodEnd = activeStripeSubscription
        ? activeStripeSubscription.current_period_end || -1
        : -1;
      subscriptionOption.cancelAt = activeStripeSubscription
        ? activeStripeSubscription.cancel_at || -1
        : -1;
      subscriptionOption.canceledAt = activeStripeSubscription
        ? activeStripeSubscription.canceled_at || -1
        : -1;
    }

    subscriptionOptions.push(subscriptionOption);
  }

  const responseMessage: ResponseMessage = ApplicationSubscriptionMessage.getSubscriptionOptionsResponse(
    subscriptionOptions,
    StatusCodes.OK,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function subscribeApplication(
  request: Request,
  response: Response,
) {
  const { applicationId, subscriptionOptionId } = request.params;
  const activeSubscriptionResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.getActiveSubscriptionRequest(applicationId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );
  const { data }: any = activeSubscriptionResponseMessage.body;

  if (data.subscription) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.errorResponse(
      StatusCodes.CONFLICT,
      "Can't subscribe application with an active subscription.",
    );

    response
      .status(errorResponseMessage.meta.statusCode)
      .send(errorResponseMessage)
      .end();

    return;
  }

  const { userId, yearly, defaultPaymentMethodId } = request.body;
  const customerId = await getCustomerId(userId);

  if (!customerId) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.errorResponse(
      StatusCodes.NOT_FOUND,
      'You need to set payment information first.',
    );

    response
      .status(errorResponseMessage.meta.statusCode)
      .send(errorResponseMessage)
      .end();

    return;
  }

  const price = getSubscriptionPriceById(Number(subscriptionOptionId), yearly);

  if (!price) {
    logger.error(
      'subscribeApplication',
      `No price for subscription option '${subscriptionOptionId}' found.`,
    );

    const errorResponseMessage: ResponseMessage = ErrorMessage.internalServerErrorResponse();

    response
      .status(errorResponseMessage.meta.statusCode)
      .send(errorResponseMessage)
      .end();

    return;
  }

  let subscription: Stripe.Response<Stripe.Subscription>;

  try {
    subscription = await stripe.subscriptions.create({
      customer: customerId,
      default_payment_method: defaultPaymentMethodId,
      items: [
        {
          price,
        },
      ],
    });
  } catch (exception) {
    logger.fatal('subscribeApplication', exception);

    const errorResponseMessage: ResponseMessage = ErrorMessage.internalServerErrorResponse();

    response
      .status(errorResponseMessage.meta.statusCode)
      .send(errorResponseMessage)
      .end();

    return;
  }

  const createdSubscription: Subscription = {
    id: subscription.id,
    expired: false,
    option: Number(subscriptionOptionId),
  };

  const subscribeApplicationResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.subscribeApplicationRequest(
      applicationId,
      createdSubscription,
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  if (subscribeApplicationResponseMessage.meta.statusCode !== StatusCodes.OK) {
    logger.fatal(
      'subscribeApplication',
      subscribeApplicationResponseMessage.body.error,
    );

    if (subscription) {
      try {
        // ToDo: give money back on error!
        await stripe.subscriptions.del(subscription.id);
      } catch (exception) {
        logger.fatal('subscribeApplication', exception);
      }
    }

    response
      .status(subscribeApplicationResponseMessage.meta.statusCode)
      .send(subscribeApplicationResponseMessage)
      .end();

    return;
  }

  response
    .status(subscribeApplicationResponseMessage.meta.statusCode)
    .send(subscribeApplicationResponseMessage)
    .end();
}

export async function getApplicationSubscriptionInvoices(
  request: Request,
  response: Response,
) {
  const { applicationId } = request.params;
  const getAllApplicationSubscriptionIdsResponse: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.getAllApplicationSubscriptionIdsRequest(
      applicationId,
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );
  const { data }: any = getAllApplicationSubscriptionIdsResponse.body;
  const { subscriptionIds }: { subscriptionIds: string[] } = data;
  const subscriptionInvoices: SubscriptionInvoice[] = [];

  for (let i = 0; i < subscriptionIds.length; i += 1) {
    const subscriptionId: string = subscriptionIds[i];
    // eslint-disable-next-line no-await-in-loop
    const invoices = await stripe.invoices.list({
      subscription: subscriptionId,
    });

    for (let j = 0; j < invoices.data.length; j += 1) {
      const invoice = invoices.data[j];

      if (
        invoice.invoice_pdf &&
        invoice.hosted_invoice_url &&
        invoice.status_transitions.paid_at &&
        invoice.amount_paid
      ) {
        subscriptionInvoices.push({
          pdf: invoice.invoice_pdf,
          url: invoice.hosted_invoice_url,
          paidAt: invoice.status_transitions.paid_at * 1000,
          amount: invoice.amount_paid,
        });
      }
    }
  }

  const responseMessage: ResponseMessage = ApplicationSubscriptionMessage.getApplicationSubscriptionInvoicesResponse(
    subscriptionInvoices,
    StatusCodes.OK,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

function getSubscriptionOptionById(subscriptionOptionId: number) {
  if (!subscriptions) {
    return null;
  }

  for (let i = 0; i < subscriptions.length; i += 1) {
    const subscription: SubscriptionOption = subscriptions[i];

    if (Number(subscription.id) === Number(subscriptionOptionId)) {
      return subscription;
    }
  }

  return null;
}

function getSubscriptionPriceById(
  subscriptionOptionId: number,
  yearly: boolean,
) {
  const subscriptionOption: SubscriptionOption | null = getSubscriptionOptionById(
    subscriptionOptionId,
  );

  if (!subscriptionOption) {
    return null;
  }

  return yearly
    ? (subscriptionOption.priceYearId as string)
    : (subscriptionOption.priceMonthId as string);
}
