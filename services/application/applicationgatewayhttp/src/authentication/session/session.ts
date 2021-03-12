import { serializeUser, deserializeUser } from 'passport';
import { Logger } from '@backend/logger';
import { ErrorMessage } from '@backend/applicationmessagefactory';
import { ResponseMessage } from '@backend/messagehandler';
import { Request, Response, NextFunction } from '@backend/server';

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
