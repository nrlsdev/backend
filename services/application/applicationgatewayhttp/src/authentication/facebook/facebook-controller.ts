import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { ApplicationUser } from '@backend/applicationinterfaces';
import {
  ApplicationUserMessage,
  ErrorMessage,
} from '@backend/applicationmessagefactory';
import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response, StatusCodes } from '@backend/server';
import { Logger } from '@backend/logger';
import { use } from 'passport';
import {
  Strategy as FacebookStrategy,
  Profile as FacebookProfile,
} from 'passport-facebook';
import { messageManager } from '../../message-manager';

const logger: Logger = new Logger('facebook-controller');
const { authentication } = ApplicationConfiguration.applicationgatewayhttp;
const redirectBaseUrl: string = `${authentication.protocol}://${
  authentication.host ? authentication.host : 'localhost'
}:${authentication.port}`;

export function setupFacebookAuthentication() {
  use(
    new FacebookStrategy(
      {
        clientID: '1390552057796759', // ToDo: Make configurable in mgmtconsole
        clientSecret: '9659f3c3d3dd2d82c15bb8cdf56f8108', // ToDo: Make configurable in mgmtconsole
        callbackURL: `${redirectBaseUrl}/auth/facebook/callback`, // ToDo: Make configurable in mgmtconsole
        passReqToCallback: true,
      },
      async (
        _request: Request,
        accessToken: string,
        _refreshToken: string,
        profile: FacebookProfile,
        done: (error: any, user?: any, info?: any) => void,
        // eslint-disable-next-line consistent-return
      ) => {
        const { id } = profile;

        let getApplicationUserByFacebookIdResponse: ResponseMessage = await messageManager.sendReplyToMessage(
          ApplicationUserMessage.getApplicationUserByFacebookRequest(id),
          MessageQueueType.APPLICATION_DBCONNECTOR,
          MessageSeverityType.APPLICATION_USER,
        );
        let { data }: any = getApplicationUserByFacebookIdResponse.body;

        if (!data.applicationUser) {
          const createFacebookUserResponse: ResponseMessage = await messageManager.sendReplyToMessage(
            ApplicationUserMessage.applicationUserFacebookSignUpRequest(id),
            MessageQueueType.APPLICATION_DBCONNECTOR,
            MessageSeverityType.APPLICATION_USER,
          );

          if (createFacebookUserResponse.body.error) {
            logger.error(
              'setupFacebookAuthentication',
              createFacebookUserResponse.body.error,
            );

            return done(null, false);
          }

          getApplicationUserByFacebookIdResponse = await messageManager.sendReplyToMessage(
            ApplicationUserMessage.getApplicationUserByFacebookRequest(id),
            MessageQueueType.APPLICATION_DBCONNECTOR,
            MessageSeverityType.APPLICATION_USER,
          );
          data = getApplicationUserByFacebookIdResponse.body.data;
        }

        const { applicationUser }: { applicationUser: ApplicationUser } = data;

        if (!applicationUser.accounts.facebook) {
          logger.error(
            'setupFacebookAuthentication',
            'Could not create/find facebook user.',
          );

          return done(null, false);
        }

        done(null, {
          _id: applicationUser._id,
          facebook: {
            id: applicationUser.accounts.facebook.id,
            accessToken,
          },
        });
      },
    ),
  );
}

export function onFacebookSuccess(request: Request, response: Response) {
  const { id, accessToken } = (request.session as any).passport.user.facebook;
  const responseMessage: ResponseMessage = ApplicationUserMessage.loginWithFacebookSuccessResponse(
    id,
    accessToken,
    StatusCodes.OK,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export function onFacebookFailure(_request: Request, response: Response) {
  const responseMessage: ResponseMessage = ErrorMessage.internalServerErrorResponse(
    'Facebook authentication failured.',
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
