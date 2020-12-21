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
  const { bundleId, name, tokenUserId } = request.body;

  if (!bundleId || !name) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationMessage.createApplicationRequest(bundleId, name, tokenUserId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  response.status(responseMessage.meta.statusCode);
  response.send(responseMessage).end();
}

async function getAllApplicationsResponseUserHasAuthorizationFor(
  request: Request,
) {
  const { tokenUserId } = request.body;

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationMessage.getAllApplicationsUserHasAuthorizationForRequest(
      tokenUserId,
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  return responseMessage;
}

export async function getAllApplicationsUserHasAuthorizationFor(
  request: Request,
  response: Response,
) {
  const responseMessage: ResponseMessage = await getAllApplicationsResponseUserHasAuthorizationFor(
    request,
  );

  response.status(responseMessage.meta.statusCode);
  response.send(responseMessage).end();
}
