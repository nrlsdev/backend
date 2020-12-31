import { Request, Response } from '@backend/server';
import {
  ApplicationMessage,
  ErrorMessage,
} from '@backend/systemmessagefactory';
import { Application, minifyObject } from '@backend/systeminterfaces';
import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { messageManager } from '../../message-manager';

export async function updateGeneralInfo(request: Request, response: Response) {
  const application = request.body.application as Application;
  const { applicationId } = request.params;

  const minifiedApplicationData = minifyObject({
    name: application.name,
  });

  if (!applicationId || !minifiedApplicationData) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationMessage.updateApplicationDataRequest(
      minifiedApplicationData,
      applicationId,
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
