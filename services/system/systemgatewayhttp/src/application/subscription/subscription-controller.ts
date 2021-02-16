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
} from '@backend/systeminterfaces';
import { Logger } from '@backend/logger';
import { SystemConfiguration } from '@backend/systemconfiguration';
import { messageManager } from '../../message-manager';
import { stripe } from '../../stripe';

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

    subscriptionOptions.push(subscriptionOption);
  }

  const responseMessage: ResponseMessage = ApplicationSubscriptionMessage.getSubscriptionOptions(
    subscriptionOptions,
    StatusCodes.OK,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
