import {
  ResponseMessage,
  MessageQueueType,
  MessageSeverityType,
} from '@backend/messagehandler';
import { Request, Response } from '@backend/server';
import {
  ApplicationMessage,
  ErrorMessage,
} from '@backend/systemmessagefactory';
import { messageManager } from '../message-manager';

export async function createApplication(request: Request, response: Response) {
  const { bundleId, name, userId } = request.body;

  if (!bundleId || !name) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationMessage.createApplicationRequest(bundleId, name, userId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_APPLICATION,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function getAllApplicationsUserHasAuthorizationFor(
  request: Request,
  response: Response,
) {
  const { userId } = request.body;

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationMessage.getAllApplicationsUserHasAuthorizationForRequest(userId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_APPLICATION,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function getApplicationById(request: Request, response: Response) {
  const { userId } = request.body;
  const { applicationId } = request.params;

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationMessage.getApplicationByIdRequest(applicationId, userId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_APPLICATION,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
