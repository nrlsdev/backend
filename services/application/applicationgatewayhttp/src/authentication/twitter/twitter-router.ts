import { Router } from '@backend/server';
import { authenticate } from 'passport';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { onTwitterSuccess, onTwitterFailure } from './twitter-controller';

const { authentication } = ApplicationConfiguration.applicationgatewayhttp;
const redirectBaseUrl: string = `${authentication.protocol}://${
  authentication.host ? authentication.host : 'localhost'
}:${authentication.port}`;
const twitterAuthenticationRouter: Router = Router();

twitterAuthenticationRouter.get(
  '/',
  authenticate('twitter', {
    scope: [], // ToDo: Make configurable in mgmtconsole
  }),
);

twitterAuthenticationRouter.get(
  '/callback',
  authenticate('twitter', {
    successRedirect: `${redirectBaseUrl}/auth/twitter/callback/success`, // ToDo: Make configurable in mgmtconsole w/ default value
    failureRedirect: `${redirectBaseUrl}/auth/twitter/callback/failure`, // ToDo: Make configurable in mgmtconsole w/ default value
  }),
);

twitterAuthenticationRouter.get('/callback/success', onTwitterSuccess);

twitterAuthenticationRouter.get('/callback/failure', onTwitterFailure);

export { twitterAuthenticationRouter };
