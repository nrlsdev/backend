import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response, NextFunction, StatusCodes } from '@backend/server';
import { Logger } from '@backend/logger';
import {
  ApplicationUserMessage,
  ErrorMessage,
} from '@backend/applicationmessagefactory';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { authenticate, use } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { messageManager } from '../../message-manager';
import { noreplyMailer } from '../../mail-manager';

const logger: Logger = new Logger('email-and-password-controller');

const {
  protocol,
  host,
  port,
} = ApplicationConfiguration.applicationgatewayhttp.authentication;

export async function signUp(request: Request, response: Response) {
  const { email, password, userdata } = request.body;
  const activationCode: string = Date.now().toString();
  const signUpResponse: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationUserMessage.applicationUserEmailAndPasswordSignUpRequest(
      email,
      password,
      userdata,
      activationCode,
    ),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_USER,
  );

  if (!signUpResponse.body.error) {
    const activationLink: string = `${protocol}://${host === '' ? 'localhost' : host
      }:${port}/auth/emailandpassword/${activationCode}`;

    // ToDo
    noreplyMailer.sendMail({
      to: email,
      subject: 'Created Account for {APP_NAME}',
      html: `<div><a href="${activationLink}">Click</a> here to activate your account.</div>`,
    });
  }

  response.status(signUpResponse.meta.statusCode).send(signUpResponse).end();
}

export async function signIn(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  // eslint-disable-next-line consistent-return
  authenticate('local', (error, user, info) => {
    if (error) {
      const errorResponseMessage: ResponseMessage = error as ResponseMessage;

      logger.error('signIn', 'Invalid E-Mail or Password. (got error)');
      logger.error('signIn', JSON.stringify(errorResponseMessage));

      return response
        .status(errorResponseMessage.meta.statusCode)
        .send(errorResponseMessage)
        .end();
    }

    if (info) {
      const errorResponseMessage: ResponseMessage = ErrorMessage.unauthorizedErrorResponse(
        'Invalid E-Mail or Password.',
      );

      logger.error('signIn', 'Invalid E-Mail or Password. (got info)');
      logger.error('signIn', JSON.stringify(info));

      return response
        .status(errorResponseMessage.meta.statusCode)
        .send(errorResponseMessage)
        .end();
    }

    if (!user) {
      const errorResponseMessage: ResponseMessage = ErrorMessage.unauthorizedErrorResponse(
        'Invalid E-Mail or Password.',
      );

      logger.error('signIn', 'No user with this credentials found.');

      return response
        .status(errorResponseMessage.meta.statusCode)
        .send(errorResponseMessage)
        .end();
    }

    request.logIn(user, (loginError: any) => {
      if (error) {
        const errorResponseMessage: ResponseMessage = ErrorMessage.unauthorizedErrorResponse(
          'Invalid E-Mail or Password.',
        );

        logger.error('signIn', loginError);

        return response
          .status(errorResponseMessage.meta.statusCode)
          .send(errorResponseMessage)
          .end();
      }

      const responseMessage = ApplicationUserMessage.applicationUserEmailAndPasswordSignInWithUserdataResponse(
        StatusCodes.OK,
        {
          _id: user._id,
          email: user.email,
          userdata: user.userdata,
        },
      );

      return response
        .status(responseMessage.meta.statusCode)
        .send(responseMessage)
        .end();
    });
  })(request, response, next);
}

export async function activateAccount(request: Request, response: Response) {
  const { activationCode } = request.params;
  const activateResponse: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationUserMessage.applicationUserEmailAndPasswordActivateRequest(
      activationCode,
    ),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_USER,
  );

  response
    .status(activateResponse.meta.statusCode)
    .send(activateResponse)
    .end();
}

export function setupEmailAndPasswordAuthentication() {
  use(
    new LocalStrategy(
      // ToDo: Config -> email and password name fields
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        const signInResponse: ResponseMessage = await messageManager.sendReplyToMessage(
          ApplicationUserMessage.applicationUserEmailAndPasswordSignInRequest(
            email,
            password,
          ),
          MessageQueueType.APPLICATION_DBCONNECTOR,
          MessageSeverityType.APPLICATION_USER,
        );
        const { data }: any = signInResponse.body;

        if (
          signInResponse.body.error ||
          signInResponse.meta.statusCode !== StatusCodes.OK ||
          !data
        ) {
          return done(signInResponse, false);
        }

        return done(null, {
          _id: data.id,
          email: data.email,
          userdata: data.userdata,
        });
      },
    ),
  );
}
