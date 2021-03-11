import { Request, Response } from '@backend/server';
import {
  ApplicationMessage,
  ErrorMessage,
} from '@backend/systemmessagefactory';
import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Application, minifyObject } from '@backend/systeminterfaces';
import { messageManager } from '../../message-manager';

export async function updateAuthenticationMethod(
  request: Request,
  response: Response,
) {
  const application = request.body.application as Application;
  const method = request.body.method as string;
  const { applicationId } = request.params;

  const dataObject = {
    authentication: {
      methods: {},
    },
  };

  (dataObject.authentication.methods as any)[method] = (application
    .authentication?.methods as any)[method];

  const minifiedApplicationData = minifyObject(dataObject);

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
    MessageSeverityType.SYSTEM_APPLICATION,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
