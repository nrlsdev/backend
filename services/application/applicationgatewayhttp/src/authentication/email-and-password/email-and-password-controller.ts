import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response } from '@backend/server';
import { ApplicationUserMessage } from '@backend/applicationmessagefactory';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { messageManager } from '../../message-manager';
import { noreplyMailer } from '../../mail-manager';

const {
  protocol,
  host,
  port,
} = ApplicationConfiguration.applicationgatewayhttp.authentication;

export async function signup(request: Request, response: Response) {
  const { email, password } = request.body;
  const activationCode: string = Date.now().toString();
  const signUpResponse: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationUserMessage.applicationUserEmailAndPasswordSignUpRequest(
      email,
      password,
      activationCode,
    ),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_USER,
  );

  if (!signUpResponse.body.error) {
    const activationLink: string = `${protocol}://${
      host === '' ? 'localhost' : host
    }:${port}/auth/emailandpassword/${activationCode}`;

    noreplyMailer.sendMail({
      to: email,
      subject: 'Created Account for {APP_NAME}',
      html: `<div><a href="${activationLink}">Click</a> here to activate your account.</div>`,
    });
  }

  response.status(signUpResponse.meta.statusCode).send(signUpResponse).end();
}

export async function activateAccount(request: Request, response: Response) {
  const { activationCode } = request.params;
  const signUpResponse: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationUserMessage.applicationUserEmailAndPasswordActivateRequest(
      activationCode,
    ),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_USER,
  );

  response.status(signUpResponse.meta.statusCode).send(signUpResponse).end();
}
