import { serializeUser, deserializeUser } from 'passport';
import { Logger } from '@backend/logger';
import { ApplicationUser } from '@backend/applicationinterfaces';
import {
  ApplicationUserMessage,
  ErrorMessage,
} from '@backend/applicationmessagefactory';
import {
  ResponseMessage,
  MessageQueueType,
  MessageSeverityType,
} from '@backend/messagehandler';
import { Request, Response, NextFunction } from '@backend/server';
import { messageManager } from '../../message-manager';

const logger: Logger = new Logger('user-de-serialization');

export class SessionUser implements Express.User {
  public _id?: string;

  public email?: string;

  public facebook?: string;
}

export function setupUserDeSerialization() {
  serializeUser((user: SessionUser, done: (err: any, id?: any) => void) => {
    if (!user) {
      logger.error('serializeUser', 'User could not be serialized.');

      return done(null, false);
    }

    return done(null, {
      _id: user._id,
      email: user.email,
      facebook: user.facebook,
    });
  });

  deserializeUser(
    async (
      user: SessionUser,
      done: (
        err: any,
        user?: false | Express.User | null | undefined | SessionUser,
      ) => void,
    ) => {
      if (!user._id) {
        logger.error('deserializeUser', 'User could not be deserialized.');

        return done(null, false);
      }

      const getApplicationUserResponse: ResponseMessage = await messageManager.sendReplyToMessage(
        ApplicationUserMessage.getApplicationUserByIdRequest(user._id),
        MessageQueueType.APPLICATION_DBCONNECTOR,
        MessageSeverityType.APPLICATION_USER,
      );
      const applicationUser:
        | ApplicationUser
        | undefined = getApplicationUserResponse.body.data as
        | ApplicationUser
        | undefined;

      if (!applicationUser) {
        logger.error(
          'deserializeUser',
          `User with id '${user._id}' not found.`,
        );

        return done(null, false);
      }

      return done(null, {
        _id: applicationUser._id,
        email: applicationUser.accounts.emailAndPassword?.email || undefined,
        facebook: applicationUser.accounts.facebook?.id || undefined,
      });
    },
  );
}

export const sessionAuthenticationChecker = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (!request.isAuthenticated()) {
    const errorResponse: ResponseMessage = ErrorMessage.unauthorizedErrorResponse();

    response.status(errorResponse.meta.statusCode).send(errorResponse).end();

    return;
  }

  request.body.userId = (request.session as any).passport.user._id;
  request.body.userEmail = (request.session as any).passport.user.email;

  next();
};
