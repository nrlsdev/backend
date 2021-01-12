import {
  ResponseMessage,
  MessageQueueType,
  MessageSeverityType,
} from '@backend/messagehandler';
import { Request, Response } from '@backend/server';
import {
  ApplicationUserMessage,
  ErrorMessage,
} from '@backend/applicationmessagefactory';
import { messageManager } from '../../../../message-manager';

export async function emailAndPasswordSignUp(
  request: Request,
  response: Response,
) {
  const { email, password } = request.body;

  if (!email || !password) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationUserMessage.signUpRequest(email, password),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_PRIVATE,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function emailAndPasswordSignIn(
  request: Request,
  response: Response,
) {
  const { email, password } = request.body;

  if (!email || !password) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationUserMessage.signInRequest(email, password),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_PRIVATE,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
