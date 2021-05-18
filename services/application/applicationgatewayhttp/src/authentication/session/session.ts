import { serializeUser, deserializeUser } from 'passport';
import { Logger } from '@backend/logger';
import { ApplicationUserMessage, ErrorMessage } from '@backend/applicationmessagefactory';
import { MessageQueueType, MessageSeverityType, ResponseMessage } from '@backend/messagehandler';
import { Request, Response, NextFunction, StatusCodes } from '@backend/server';
import { messageManager } from '../../message-manager';

const logger: Logger = new Logger('user-de-serialization');

export class SessionUser implements Express.User {
  public _id?: string;

  public email?: string;

  public facebook?: {
    id: string;

    accessToken: string;
  };

  public twitter?: {
    id: string;

    accessTokenKey: string;

    accessTokenSecret: string;
  };

  public userdata?: any;
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
      twitter: user.twitter,
      userdata: user.userdata,
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
      if (!user) {
        logger.error('deserializeUser', 'User could not be deserialized.');

        return done(null, false);
      }

      return done(null, {
        _id: user._id,
        email: user.email,
        facebook: user.facebook,
        twitter: user.twitter,
        userdata: user.userdata,
      });
    },
  );
}

export const sessionAuthenticationChecker = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (!request.isAuthenticated()) {
    const errorResponse: ResponseMessage = ErrorMessage.unauthorizedErrorResponse();

    response.status(errorResponse.meta.statusCode).send(errorResponse).end();

    return;
  }

  const { _id, email, facebook, twitter, userdata } = (request.session as any).passport.user;

  // ToDo Check email, facebook or twitter if valid/exist
  const getUserByIdRequest: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationUserMessage.getApplicationUserByIdRequest(
      _id,
    ),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_USER,
  );

  if (getUserByIdRequest.meta.statusCode !== StatusCodes.OK) {
    const errorResponse: ResponseMessage = ErrorMessage.unauthorizedErrorResponse();

    request.logout();

    response.status(errorResponse.meta.statusCode).send(errorResponse).end();

    return;
  }

  request.body.userId = _id;
  request.body.userEmail = email;
  request.body.userFacebook = facebook;
  request.body.userTwitter = twitter;
  request.body.userdata = userdata;

  next();
};
