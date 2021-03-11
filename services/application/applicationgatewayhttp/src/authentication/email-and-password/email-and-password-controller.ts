import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response } from '@backend/server';
import { ApplicationUserMessage } from '@backend/applicationmessagefactory';
import { messageManager } from '../../message-manager';

export async function signup(request: Request, response: Response) {
  const { email, password } = request.body;
  const signUpResponse: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationUserMessage.applicationUserEmailAndPasswordSignUpRequest(
      email,
      password,
    ),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_USER,
  );

  response.status(signUpResponse.meta.statusCode).send(signUpResponse).end();
}
