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
import { SystemConfiguration } from '@backend/systemconfiguration';
import { noreplyMailer } from '../../mail-manager';
import { messageManager } from '../../message-manager';

const { protocol, host, port } = SystemConfiguration.systemMgmtConsole;

export async function inviteUserToTeam(request: Request, response: Response) {
  const { id, email } = request.body;

  if (!id || !email) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationTeamMessage.inviteUserToTeamRequest(id, email),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  if (responseMessage.meta.statusCode === StatusCodes.OK) {
    const { invitationCode } = responseMessage.body.data! as any;

    noreplyMailer.sendMail({
      to: email,
      subject: 'You have been invited to work on an application.',
      html: `<div><a href="${protocol}://${
        host === '' ? 'localhost' : host
      }:${port}/application/team/accept/${invitationCode}">Click</a> here to accept the invitation.</div>`,
    });
  }

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function acceptInvitation(request: Request, response: Response) {
  const { invitationCode } = request.params;
  const { tokenUserId } = request.body;

  if (!invitationCode || !tokenUserId) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationTeamMessage.acceptInvitationRequest(tokenUserId, invitationCode),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
