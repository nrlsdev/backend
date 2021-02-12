import { Request, Response, NextFunction, StatusCodes } from '@backend/server';
import { use, serializeUser, deserializeUser, authenticate } from 'passport';
import { Logger } from '@backend/logger';
import { Strategy as LocalStrategy } from 'passport-local';
import { ErrorMessage, SystemUserMessage } from '@backend/systemmessagefactory';
import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { messageManager } from '../message-manager';

const logger: Logger = new Logger('authentication-controller');

export function setupLocalAuthentication() {
  serializeUser((user: any, done) => {
    if (!user) {
      logger.error('serializeUser', 'User could not be serialized.');

      return done(null, false);
    }

    return done(null, {
      _id: user._id,
      email: user.email,
    });
  });

  deserializeUser(async (user: any, done) => {
    const systemUserResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
      SystemUserMessage.getSystemUserDataRequest(user._id),
      MessageQueueType.SYSTEM_DBCONNECTOR,
      MessageSeverityType.SYSTEM_USER,
    );
    const { data }: any = systemUserResponseMessage.body;

    if (systemUserResponseMessage.meta.statusCode !== StatusCodes.OK || !data) {
      logger.error('deserializeUser', 'User could not be deserialized.');

      return done(null, false);
    }

    return done(null, {
      _id: data._id,
      email: data.email,
    });
  });

  use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        const signInResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
          SystemUserMessage.signInSystemUserRequest(email, password),
          MessageQueueType.SYSTEM_DBCONNECTOR,
          MessageSeverityType.SYSTEM_USER,
        );
        const { data }: any = signInResponseMessage.body;

        if (signInResponseMessage.body.error || !data) {
          logger.error('use', signInResponseMessage.body.error);

          return done(null, false);
        }

        if (signInResponseMessage.meta.statusCode !== StatusCodes.OK) {
          logger.error(
            'use',
            `Signin request failed with statuscode '${signInResponseMessage.meta.statusCode}'.`,
          );

          return done(null, false);
        }

        return done(null, {
          _id: data._id,
          email: data.email,
        });
      },
    ),
  );
}

export async function signUp(request: Request, response: Response) {
  const { email, firstname, lastname, password } = request.body;

  if (!email || !firstname || !lastname || !password) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    SystemUserMessage.createSystemUserRequest(
      email,
      firstname,
      lastname,
      password,
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_USER,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export function signIn(
  request: Request,
  response: Response,
  next: NextFunction,
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

  authenticate('local', (error, user, info) => {
    if (error) {
      const errorResponseMessage: ResponseMessage = ErrorMessage.internalServerErrorResponse();

      logger.error('signIn', error);

      return response
        .status(errorResponseMessage.meta.statusCode)
        .send(errorResponseMessage)
        .end();
    }

    if (info) {
      const errorResponseMessage: ResponseMessage = ErrorMessage.internalServerErrorResponse();

      logger.error('signIn', info);

      return response
        .status(errorResponseMessage.meta.statusCode)
        .send(errorResponseMessage)
        .end();
    }

    if (!user) {
      const errorResponseMessage: ResponseMessage = ErrorMessage.internalServerErrorResponse();

      logger.error('signIn', 'No user found.');

      return response
        .status(errorResponseMessage.meta.statusCode)
        .send(errorResponseMessage)
        .end();
    }

    request.logIn(user, (loginError: any) => {
      if (loginError) {
        const errorResponseMessage: ResponseMessage = ErrorMessage.internalServerErrorResponse();

        logger.error('signIn', loginError);

        return response
          .status(errorResponseMessage.meta.statusCode)
          .send(errorResponseMessage)
          .end();
      }

      const successResponseMessage: ResponseMessage = SystemUserMessage.signedInSystemUserResponse(
        StatusCodes.OK,
      );

      return response
        .status(successResponseMessage.meta.statusCode)
        .send(successResponseMessage)
        .end();
    });
  })(request, response, next);
}

export function signOut(request: Request, response: Response) {
  const successResponseMessage: ResponseMessage = SystemUserMessage.signedOutSystemUserResponse(
    StatusCodes.OK,
  );

  request.logout();

  return response
    .status(successResponseMessage.meta.statusCode)
    .send(successResponseMessage)
    .end();
}

export function isAuthenticated(_request: Request, response: Response) {
  const successResponseMessage: ResponseMessage = SystemUserMessage.isSystemUserAuthenticatedResponse(
    StatusCodes.OK,
  );

  return response
    .status(successResponseMessage.meta.statusCode)
    .send(successResponseMessage)
    .end();
}
