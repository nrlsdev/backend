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
  SubscriptionLineItem,
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
  const { userId } = request.body;
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

  const { applicationId } = request.params;
  const subscriptionIdResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.getActiveSubscriptionRequest(applicationId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_APPLICATION,
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
    if (subscriptionOption.active && activeStripeSubscription) {
      // eslint-disable-next-line no-await-in-loop
      const customer = await stripe.customers.retrieve(customerId);

      subscriptionOption.startDate = activeStripeSubscription
        ? Number(activeStripeSubscription.start_date) * 1000 || -1
        : -1;
      subscriptionOption.currentPeriodEnd = activeStripeSubscription
        ? Number(activeStripeSubscription.current_period_end) * 1000 || -1
        : -1;
      // eslint-disable-next-line no-nested-ternary
      subscriptionOption.cancelAt = activeStripeSubscription
        ? activeStripeSubscription.cancel_at
          ? Number(activeStripeSubscription.cancel_at) * 1000
          : -1 || -1
        : -1;
      // eslint-disable-next-line no-nested-ternary
      subscriptionOption.canceledAt = activeStripeSubscription
        ? activeStripeSubscription.canceled_at
          ? Number(activeStripeSubscription.canceled_at) * 1000
          : -1 || -1
        : -1;
      subscriptionOption.defaultCardId = activeStripeSubscription.default_source
        ? activeStripeSubscription.default_source?.toString()
        : (customer as any).default_source.toString();
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
    MessageSeverityType.SYSTEM_APPLICATION,
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

  const { userId, yearly, paymentMethodId, promotionCode } = request.body;
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
      default_payment_method: paymentMethodId,
      items: [
        {
          price,
        },
      ],
      coupon: promotionCode as string | undefined,
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
    option: Number(subscriptionOptionId),
  };

  const subscribeApplicationResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.subscribeApplicationRequest(
      applicationId,
      createdSubscription,
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_APPLICATION,
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

export async function changeSubscription(request: Request, response: Response) {
  const { yearly, paymentMethodId, userId, promotionCode } = request.body;
  const { applicationId, subscriptionOptionId } = request.params;

  if (
    yearly === undefined ||
    paymentMethodId === undefined ||
    subscriptionOptionId === undefined
  ) {
    const errorResponse = ErrorMessage.unprocessableEntityErrorResponse();

    response.status(errorResponse.meta.statusCode).send(errorResponse).end();

    return;
  }

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

  const activeSubscriptionResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.getActiveSubscriptionRequest(applicationId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_APPLICATION,
  );
  const { data }: any = activeSubscriptionResponseMessage.body;

  if (!data || !data.subscription) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.errorResponse(
      StatusCodes.NOT_FOUND,
      "Can't change subscription if application do not have any subscription.",
    );

    response
      .status(errorResponseMessage.meta.statusCode)
      .send(errorResponseMessage)
      .end();

    return;
  }

  const activeSubscription: Subscription = data.subscription;
  const oldSubscriptionId: number = activeSubscription.option;

  if (Number(activeSubscription.option) === Number(subscriptionOptionId)) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.errorResponse(
      StatusCodes.BAD_REQUEST,
      "Can't change subscription to same subscription option.",
    );

    response
      .status(errorResponseMessage.meta.statusCode)
      .send(errorResponseMessage)
      .end();

    return;
  }

  const changeSubscriptionResponse: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.changeSubscriptionRequest(
      applicationId,
      Number(subscriptionOptionId),
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_APPLICATION,
  );

  if (changeSubscriptionResponse.body.error) {
    logger.error('changeSubscription', 'Could not change subscription.');

    response
      .status(changeSubscriptionResponse.meta.statusCode)
      .send(changeSubscriptionResponse)
      .end();

    return;
  }

  const price = getSubscriptionPriceById(Number(subscriptionOptionId), yearly);

  if (!price) {
    logger.error(
      'changeSubscription',
      `No price for subscription option '${subscriptionOptionId}' found.`,
    );

    await revertChangeSubscription(applicationId, oldSubscriptionId);

    const errorResponseMessage: ResponseMessage = ErrorMessage.internalServerErrorResponse();

    response
      .status(errorResponseMessage.meta.statusCode)
      .send(errorResponseMessage)
      .end();

    return;
  }

  const activeStripeSubscription = await stripe.subscriptions.retrieve(
    activeSubscription.id,
  );

  try {
    if (Number(activeSubscription.option) >= Number(subscriptionOptionId)) {
      await stripe.subscriptions.update(activeSubscription.id, {
        items: [
          {
            id: activeStripeSubscription.items.data[0].id,
            price,
          },
        ],
        proration_behavior: 'none',
        billing_cycle_anchor: 'now',
        coupon: promotionCode as string | undefined,
      });
    } else {
      const prorationDate = getProrationDate(activeStripeSubscription);

      await stripe.subscriptions.update(activeSubscription.id, {
        items: [
          {
            id: activeStripeSubscription.items.data[0].id,
            price,
          },
        ],
        proration_date: Math.floor(prorationDate.getTime() / 1000),
        proration_behavior: 'create_prorations',
        billing_cycle_anchor: 'now',
        coupon: promotionCode as string | undefined,
      });
    }
  } catch (exception) {
    const errorResponse: ResponseMessage = ErrorMessage.internalServerErrorResponse(
      'Could not change subscription.',
    );

    await revertChangeSubscription(applicationId, oldSubscriptionId);

    logger.fatal('changeSubscription', exception);

    if (changeSubscriptionResponse.body.error) {
      logger.error('changeSubscription', 'Could not change subscription.');

      response
        .status(changeSubscriptionResponse.meta.statusCode)
        .send(changeSubscriptionResponse)
        .end();

      return;
    }

    response.status(errorResponse.meta.statusCode).send(errorResponse).end();

    return;
  }

  response
    .status(changeSubscriptionResponse.meta.statusCode)
    .send(changeSubscriptionResponse)
    .end();
}

async function revertChangeSubscription(
  applicationId: string,
  subscriptionOptionId: number,
) {
  const revertSubscriptionResponse: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.changeSubscriptionRequest(
      applicationId,
      Number(subscriptionOptionId),
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_APPLICATION,
  );

  if (revertSubscriptionResponse.body.error) {
    logger.fatal(
      'revertChangeSubscription',
      'Could not revert subscriptionOptionId after change subscription failed.',
    );
  } else {
    logger.warn(
      'revertChangeSubscription',
      `Reverted subscriptionOptionId to '${subscriptionOptionId}'.`,
    );
  }
}

export async function cancelSubscription(request: Request, response: Response) {
  const { applicationId } = request.params;
  const getActiveSubscriptionResponse: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.getActiveSubscriptionRequest(applicationId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_APPLICATION,
  );
  const { data }: any = getActiveSubscriptionResponse.body;

  if (!data.subscription) {
    logger.error('cancelSubscription', 'Could not cancel subscription.');

    response
      .status(getActiveSubscriptionResponse.meta.statusCode)
      .send(getActiveSubscriptionResponse)
      .end();

    return;
  }

  const activeSubscription: Subscription = data.subscription;
  let subscription: Stripe.Subscription;

  try {
    await stripe.subscriptions.update(activeSubscription.id, {
      cancel_at_period_end: true,
    });
    subscription = await stripe.subscriptions.retrieve(activeSubscription.id);
  } catch (exception) {
    const errorResponse: ResponseMessage = ErrorMessage.internalServerErrorResponse(
      'Could not cancel subscription.',
    );

    logger.fatal('cancelSubscription', exception);

    response.status(errorResponse.meta.statusCode).send(errorResponse).end();

    return;
  }

  const cancelDate: Date = new Date(subscription.cancel_at! * 1000);
  cancelDate.setHours(23);
  cancelDate.setMinutes(59);
  cancelDate.setSeconds(59);
  cancelDate.setMilliseconds(999);

  const cancelSubscriptionResponse: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.cancelSubscriptionRequest(
      applicationId,
      cancelDate.getTime(),
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_APPLICATION,
  );

  if (cancelSubscriptionResponse.body.error) {
    logger.fatal('cancelSubscription', 'Could not cancel subscription!');

    await stripe.subscriptions.update(activeSubscription.id, {
      cancel_at_period_end: false,
    });
  }

  response
    .status(cancelSubscriptionResponse.meta.statusCode)
    .send(cancelSubscriptionResponse)
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
    MessageSeverityType.SYSTEM_APPLICATION,
  );
  const { data }: any = getAllApplicationSubscriptionIdsResponse.body;
  const { subscriptionIds }: { subscriptionIds: string[] } = data;
  const subscriptionInvoices: SubscriptionInvoice[] = [];

  for (let i = 0; i < subscriptionIds.length; i += 1) {
    const subscriptionId: string = subscriptionIds[i];
    // eslint-disable-next-line no-await-in-loop
    const invoices = await stripe.invoices.list({
      subscription: subscriptionId,
      limit: 100, // ToDo
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

export async function getUpcomingSubscriptionInvoice(
  request: Request,
  response: Response,
) {
  const { applicationId, subscriptionOptionId, yearly } = request.params;
  const { userId } = request.body;

  if (subscriptionOptionId === undefined || yearly === undefined) {
    const errorResponse = ErrorMessage.unprocessableEntityErrorResponse();

    response.status(errorResponse.meta.statusCode).send(errorResponse).end();

    return;
  }

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

  const activeSubscriptionResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.getActiveSubscriptionRequest(applicationId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_APPLICATION,
  );
  const { data }: any = activeSubscriptionResponseMessage.body;
  const price = getSubscriptionPriceById(
    Number(subscriptionOptionId),
    yearly === 'true',
  );

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

  const { promotionCode } = request.query;
  const activeSubscription: Subscription | undefined = data.subscription;
  let invoice;
  let promotionCodeSuccess: boolean = false;

  try {
    invoice = await createUpcomingInvoice(
      customerId,
      subscriptionOptionId,
      price,
      activeSubscription,
      promotionCode as string | undefined,
    );
    promotionCodeSuccess = true;
  } catch (exceptionOne) {
    logger.fatal('getUpcomingSubscriptionInvoice', exceptionOne);
    try {
      invoice = await createUpcomingInvoice(
        customerId,
        subscriptionOptionId,
        price,
        activeSubscription,
      );
      promotionCodeSuccess = false;
    } catch (exceptionTwo) {
      logger.fatal('getUpcomingSubscriptionInvoice', exceptionTwo);

      const errorResponseMessage: ResponseMessage = ErrorMessage.internalServerErrorResponse();

      response
        .status(errorResponseMessage.meta.statusCode)
        .send(errorResponseMessage)
        .end();

      return;
    }
  }

  const lines = invoice.lines.data.reverse();
  const subscriptionLineItems: SubscriptionLineItem[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    subscriptionLineItems.push({
      id: invoice.lines.data.length - i - 1,
      amount: line.amount,
      description: line.description,
    });
  }

  // ToDo: More promotion codes
  if (invoice.discount && invoice.total_discount_amounts) {
    subscriptionLineItems.push({
      id: subscriptionLineItems.length,
      amount: -invoice.total_discount_amounts[0].amount,
      description: invoice.discount.coupon.name,
    });
    promotionCodeSuccess = true;
  }

  const responseMessage: ResponseMessage = ApplicationSubscriptionMessage.getApplicationSubscriptionNextInvoicePriceResponse(
    invoice.total,
    subscriptionLineItems,
    promotionCodeSuccess,
    StatusCodes.OK,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function changeApplicationPaymentMethod(
  request: Request,
  response: Response,
) {
  const { cardId } = request.body;
  const { applicationId } = request.params;
  const subscriptionIdResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationSubscriptionMessage.getActiveSubscriptionRequest(applicationId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_APPLICATION,
  );
  const { data }: any = subscriptionIdResponseMessage.body;
  const activeSubscription: Subscription | null = data
    ? data.subscription || null
    : null;

  if (!activeSubscription) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.errorResponse(
      StatusCodes.NOT_FOUND,
      "Can't change application payment method if application do not have any subscription.",
    );

    response
      .status(errorResponseMessage.meta.statusCode)
      .send(errorResponseMessage)
      .end();

    return;
  }

  try {
    await stripe.subscriptions.update(activeSubscription.id, {
      default_source: cardId,
    });
  } catch (exception) {
    logger.fatal(
      'changeApplicationPaymentMethod',
      'Could not change subscriptions payment method.',
    );
  }

  const responseMessage: ResponseMessage = ApplicationSubscriptionMessage.changeApplicationSubscriptionPaymentMethodResponse(
    StatusCodes.OK,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

async function createUpcomingInvoice(
  customerId: string,
  subscriptionOptionId: number | string,
  price: string,
  activeSubscription?: Subscription,
  promotionCode?: string,
) {
  let upcomingInvoice: Stripe.Response<Stripe.Invoice>;
  if (!activeSubscription) {
    upcomingInvoice = await stripe.invoices.retrieveUpcoming({
      customer: customerId,
      subscription_items: [
        {
          price,
        },
      ],
      coupon: promotionCode || undefined,
    });
  } else {
    const activeStripeSubscription: Stripe.Response<Stripe.Subscription> = await stripe.subscriptions.retrieve(
      activeSubscription.id,
    );
    const downgrade: boolean =
      Number(activeSubscription.option) >= Number(subscriptionOptionId);
    const prorationDate: Date = getProrationDate(activeStripeSubscription);

    upcomingInvoice = await stripe.invoices.retrieveUpcoming({
      customer: customerId,
      subscription: activeSubscription.id,
      subscription_items: [
        {
          id: activeStripeSubscription.items.data[0].id,
          price,
        },
      ],
      subscription_proration_date: downgrade
        ? undefined
        : Math.floor(prorationDate.getTime() / 1000),
      subscription_proration_behavior: downgrade ? 'none' : 'create_prorations',
      subscription_billing_cycle_anchor: 'now',
      coupon: promotionCode || undefined,
    });
  }

  return upcomingInvoice;
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

function getProrationDate(subscription: Stripe.Subscription) {
  const subscriptionCreatedDate = new Date(
    subscription.billing_cycle_anchor * 1000,
  );
  const subscriptionChangeDate = new Date();

  subscriptionChangeDate.setDate(subscriptionChangeDate.getDate() + 1);
  subscriptionChangeDate.setHours(subscriptionCreatedDate.getHours());
  subscriptionChangeDate.setMinutes(subscriptionCreatedDate.getMinutes());
  subscriptionChangeDate.setSeconds(subscriptionCreatedDate.getSeconds());
  subscriptionChangeDate.setMilliseconds(
    subscriptionCreatedDate.getMilliseconds(),
  );

  return subscriptionChangeDate;
}
