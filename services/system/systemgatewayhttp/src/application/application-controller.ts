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
    ApplicationMessage.createApplicationRequest(bundleId, name, [tokenUserId]),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  response.status(responseMessage.meta.statusCode);
  response.send(responseMessage).end();
}
