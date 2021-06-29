import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response, StatusCodes } from '@backend/server';
import {
  ApplicationUserMessage,
  ErrorMessage,
} from '@backend/applicationmessagefactory';
import { use } from 'passport';
import {
  Strategy as TwitterStrategy,
  Profile as TwitterProfile,
} from 'passport-twitter';
import { Logger } from '@backend/logger';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { ApplicationUser } from '@backend/applicationinterfaces';
import { messageManager } from '../../message-manager';

const logger: Logger = new Logger('twitter-controller');
const { authentication } = ApplicationConfiguration.applicationgatewayhttp;
const redirectBaseUrl: string = `${authentication.protocol}://${authentication.host ? authentication.host : 'localhost'
  }:${authentication.port}`;

export function setupTwitterAuthentication() {
  use(
    new TwitterStrategy(
      {
        consumerKey: 'muFyteJX37HiBMlpvQiqlCuaP', // ToDo: Make configurable in mgmtconsole
        consumerSecret: 'gtGZw72h6Vh7aB9TlyWkwZwbuHltYpYGLtJk2t9owhRMX5da3q', // ToDo: Make configurable in mgmtconsole
        callbackURL: `${redirectBaseUrl}/auth/twitter/callback`, // ToDo: Make configurable in mgmtconsole
      },
      async (
        accessTokenKey: string,
        accessTokenSecret: string,
        profile: TwitterProfile,
        done: (error: any, user?: any) => void,
        // eslint-disable-next-line consistent-return
      ) => {
        const { id } = profile;
        let getApplicationUserByTwitterIdResponse: ResponseMessage = await messageManager.sendReplyToMessage(
          ApplicationUserMessage.getApplicationUserByTwitterRequest(id),
          MessageQueueType.APPLICATION_DBCONNECTOR,
          MessageSeverityType.APPLICATION_USER,
        );
        let { data }: any = getApplicationUserByTwitterIdResponse.body;

        if (!data.applicationUser) {
          const createTwitterUserResponse: ResponseMessage = await messageManager.sendReplyToMessage(
            ApplicationUserMessage.applicationUserTwitterSignUpRequest(id),
            MessageQueueType.APPLICATION_DBCONNECTOR,
            MessageSeverityType.APPLICATION_USER,
          );

          if (createTwitterUserResponse.body.error) {
            logger.error(
              'setupTwitterAuthentication',
              createTwitterUserResponse.body.error,
            );

            return done(null, false);
          }

          getApplicationUserByTwitterIdResponse = await messageManager.sendReplyToMessage(
            ApplicationUserMessage.getApplicationUserByTwitterRequest(id),
            MessageQueueType.APPLICATION_DBCONNECTOR,
            MessageSeverityType.APPLICATION_USER,
          );
          data = getApplicationUserByTwitterIdResponse.body.data;
        }

        const { applicationUser }: { applicationUser: ApplicationUser } = data;

        if (!applicationUser.accounts.twitter) {
          logger.error(
            'setupTwitterAuthentication',
            'Could not create/find twitter user.',
          );

          return done(null, false);
        }

        done(null, {
          _id: applicationUser._id,
          twitter: {
            id: applicationUser.accounts.twitter.id,
            accessTokenKey,
            accessTokenSecret,
          },
        });
      },
    ),
  );
}

export function onTwitterSuccess(request: Request, response: Response) {
  const {
    id,
    accessTokenKey,
    accessTokenSecret,
  } = (request.session as any).passport.user.twitter;
  const responseMessage: ResponseMessage = ApplicationUserMessage.loginWithTwitterSuccessResponse(
    id,
    accessTokenKey,
    accessTokenSecret,
    StatusCodes.OK,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export function onTwitterFailure(_request: Request, response: Response) {
  const responseMessage: ResponseMessage = ErrorMessage.internalServerErrorResponse(
    'Twitter authentication failured.',
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
