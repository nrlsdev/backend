import {
  ResponseMessage,
  MessageQueueType,
  MessageSeverityType,
} from '@backend/messagehandler';
import { Request, Response, NextFunction, StatusCodes } from '@backend/server';
import {
  ApplicationMessage,
  ErrorMessage,
} from '@backend/systemmessagefactory';
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
      MessageSeverityType.SYSTEM_APPLICATION,
    );
    const { statusCode } = responseMessage.meta;
    const { data } = responseMessage.body as any;

    if (!data || !data.role) {
      const errorMessage = ErrorMessage.unprocessableEntityErrorResponse();

      response.status(errorMessage.meta.statusCode).send(errorMessage).end();

      return;
    }

    if (data.role < role || statusCode !== StatusCodes.OK) {
      const errorMessage = ErrorMessage.forbiddenErrorResponse(
        'You are not authorized to execute this action.',
      );

      response.status(errorMessage.meta.statusCode).send(errorMessage).end();

      return;
    }

    next();
  };
}
