import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response } from '@backend/server';
import {
  ApplicationTeamMessage,
  ErrorMessage,
} from '@backend/systemmessagefactory';
import { messageManager } from '../../message-manager';

export async function addUserToTeam(request: Request, response: Response) {
  const { id, email } = request.body;

  if (!id || !email) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationTeamMessage.teamAddUserRequest(id, email),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  response.status(200).send(responseMessage).end();
}
