import {
  ResponseMessage,
  MessageQueueType,
  MessageSeverityType,
} from '@backend/messagehandler';
import { Request, Response } from '@backend/server';
import { SystemUserMessage } from '@backend/systemmessagefactory';
import { messageManager } from '../message-manager';

export async function onGetSystemuserData(
  request: Request,
  response: Response,
) {
  const { tokenUserId } = request.body;
  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    SystemUserMessage.getSystemUserDataRequest(tokenUserId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_USER,
  );

  response.status(responseMessage.meta.statusCode);
  response.send(responseMessage).end();
}
