import { Router } from '@backend/server';
import { authenticate } from 'passport';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { onFacebookSuccess, onFacebookFailure } from './facebook-controller';

const { authentication } = ApplicationConfiguration.applicationgatewayhttp;
const redirectBaseUrl: string = `${authentication.protocol}://${
  authentication.host ? authentication.host : 'localhost'
}:${authentication.port}`;
const facebookAuthenticationRouter: Router = Router();

facebookAuthenticationRouter.get(
  '/',
  authenticate('facebook', {
    scope: [], // ToDo: Make configurable in mgmtconsole
  }),
);

facebookAuthenticationRouter.get(
  '/callback',
  authenticate('facebook', {
    successRedirect: `${redirectBaseUrl}/auth/facebook/callback/success`, // ToDo: Make configurable in mgmtconsole w/ default value
    failureRedirect: `${redirectBaseUrl}/auth/facebook/callback/failure`, // ToDo: Make configurable in mgmtconsole w/ default value
  }),
);

facebookAuthenticationRouter.get('/callback/success', onFacebookSuccess);

facebookAuthenticationRouter.get('/callback/failure', onFacebookFailure);

export { facebookAuthenticationRouter };
