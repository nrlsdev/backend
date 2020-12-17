import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response, StatusCodes } from '@backend/server';
import {
  ApplicationTeamMessage,
  ErrorMessage,
} from '@backend/systemmessagefactory';
import { noreplyMailer } from '../../mail-manager';
import { messageManager } from '../../message-manager';

export async function inviteUserToTeam(request: Request, response: Response) {
  const { id, email } = request.body;

  if (!id || !email) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationTeamMessage.inviteUserToTeamRequest(id, email),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  if (responseMessage.meta.statusCode === StatusCodes.OK) {
    noreplyMailer.sendMail({
      to: email,
      subject: '[INVITE SUBJECT]',
      text: '[INVITE TEXT]',
      html: '[INVITE HTML]',
    });
  }

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
