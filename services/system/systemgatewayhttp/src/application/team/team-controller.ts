import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response, StatusCodes } from '@backend/server';
import { SystemConfiguration } from '@backend/systemconfiguration';
import {
  ApplicationTeamMessage,
  ErrorMessage,
} from '@backend/systemmessagefactory';
import { noreplyMailer } from '../../mail-manager';
import { messageManager } from '../../message-manager';

export async function inviteUserToTeam(request: Request, response: Response) {
  const { email, role, applicationId } = request.body;
  const { protocol, host, port } = SystemConfiguration.systemMgmtConsole;

  if (!email || !role || !applicationId) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();
  }
  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationTeamMessage.inviteUserToTeamRequest(email, role, applicationId),
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
    }); // ToDo: HTML template
  }

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function acceptInvitation(request: Request, response: Response) {
  const { invitationCode, userId } = request.body;
  const expirationTimeInMillis: number = (invitationCode.split(
    ':',
  )[1] as unknown) as number;
  const isValidationCodeValid = new Date().getTime() <= expirationTimeInMillis;

  if (!isValidationCodeValid) {
    const responseMessage: ResponseMessage = ApplicationTeamMessage.acceptInvitationResponse(
      StatusCodes.BAD_REQUEST,
      'Validation link is not valid. Please contact and authorized User to invite you again.',
    );

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationTeamMessage.acceptInvitationRequest(invitationCode, userId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function deleteInvitation(request: Request, response: Response) {
  const { applicationId, userId } = request.params;

  if (!applicationId || !userId) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationTeamMessage.deleteInvitationRequest(applicationId, userId),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function updateAuthorizedUser(
  request: Request,
  response: Response,
) {
  const { applicationId, userId } = request.params;
  const { role } = request.body;

  if (!applicationId || !userId || !role) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationTeamMessage.updateAuthorizedUserRequest(
      applicationId,
      role,
      userId,
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
