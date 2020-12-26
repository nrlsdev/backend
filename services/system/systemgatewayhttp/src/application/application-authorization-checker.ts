import {
  ResponseMessage,
  MessageQueueType,
  MessageSeverityType,
} from '@backend/messagehandler';
import { Request, Response, NextFunction } from '@backend/server';
import { ApplicationMessage } from '@backend/systemmessagefactory';
import { ApplicationRole } from '@backend/systeminterfaces';
import { messageManager } from '../message-manager';

export function checkApplicationAuthorization(role: ApplicationRole) {
  return async function (
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const { userId } = request.body;
    const { applicationId } = request.params;

    const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
      ApplicationMessage.getUserApplicationRoleRequest(applicationId, userId),
      MessageQueueType.SYSTEM_DBCONNECTOR,
      MessageSeverityType.APPLICATION,
    );
    const { statusCode } = responseMessage.meta;
    const { data } = responseMessage.body as any;

    if (!data || !data.role) {
      response.status(statusCode).send(responseMessage).end();
      return;
    }

    if (data.role < role) {
      response.status(statusCode).send(responseMessage).end();
      return;
    }

    next();
  };
}
