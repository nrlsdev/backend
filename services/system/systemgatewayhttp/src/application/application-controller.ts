import {
  ResponseMessage,
  MessageQueueType,
  MessageSeverityType,
} from '@backend/messagehandler';
import { Request, Response } from '@backend/server';
import { ApplicationMessage } from '@backend/systemmessagefactory';
import { messageManager } from '../message-manager';

export async function createApplication(request: Request, response: Response) {
  const { bundleId, name, tokenUserId } = request.body;
  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationMessage.createApplicationRequest(bundleId, name, [
      {
        userId: tokenUserId,
      },
    ]),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  response.status(responseMessage.meta.statusCode);
  response.send(responseMessage).end();
}

export async function getAllApplicationsUserHasAuthorizationFor(
  request: Request,
  response: Response,
) {
  const { tokenUserId } = request.body;

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationMessage.getAllApplicationsUserHasAuthorizationForRequest(
      tokenUserId,
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  response.status(responseMessage.meta.statusCode);
  response.send(responseMessage).end();
}
