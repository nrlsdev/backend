import { Server, ServerSessionOptions } from '@backend/server';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { initialize, session as passportSession } from 'passport';
import {
  publicAuthenticationRouter,
  privateAuthenticationRouter,
} from './authentication/authentication-router';
import {
  sessionAuthenticationChecker,
  setupUserDeSerialization,
} from './authentication/session/session';
import { setupEmailAndPasswordAuthentication } from './authentication/email-and-password/email-and-password-controller';
import { setupFacebookAuthentication } from './authentication/facebook/facebook-controller';
import { setupTwitterAuthentication } from './authentication/twitter/twitter-controller';
import { operationsRouter } from './operations/operations-router';
import { pushNotificationsRouter } from './push-notifications/push-notifications-router';

const {
  applicationgatewayhttp,
  applicationSession,
  applicationdbconnector,
} = ApplicationConfiguration;
const authenticationServer: Server = new Server(
  applicationgatewayhttp.authentication.host,
  applicationgatewayhttp.authentication.port,
  true,
);
const applicationServer: Server = new Server(
  applicationgatewayhttp.application.host,
  applicationgatewayhttp.application.port,
  true,
);
const sessionOptions: ServerSessionOptions = {
  secret: applicationSession.secret,
  resave: applicationSession.resave,
  saveUninitialized: applicationSession.saveUninitialized,
  cookie: {
    maxAge: Number(applicationSession.cookieMaxAge),
    httpOnly: applicationSession.cookieHttpOnly,
    secure: applicationSession.cookieSecure,
  },
  mongoSessionStorage: {
    uri: `
    mongodb://${applicationdbconnector.dbUsername}:${applicationdbconnector.dbPassword}@${applicationdbconnector.dbHost}:${applicationdbconnector.dbPort}/${applicationdbconnector.dbName}
    `, // ToDo: DB String generator
    collection: applicationSession.mongoStorageCollection,
  },
};

authenticationServer.useCorsMiddleware({
  origin: true, // ToDo: whitelisted domains (custom middleware): https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express
  credentials: true,
});
authenticationServer.useJsonMiddleware();
authenticationServer.useLanguageMiddleware();
authenticationServer.useCookieParserMiddleware();
authenticationServer.useExpressSession(sessionOptions);
authenticationServer.Application.use(initialize());
authenticationServer.Application.use(passportSession());

authenticationServer.Application.use('/auth', publicAuthenticationRouter);
authenticationServer.Application.use(sessionAuthenticationChecker);
authenticationServer.Application.use('/auth', privateAuthenticationRouter);

applicationServer.useCorsMiddleware({
  origin: true, // ToDo: whitelisted domains (custom middleware): https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express
  credentials: true,
});
applicationServer.useJsonMiddleware();
applicationServer.useLanguageMiddleware();
applicationServer.useCookieParserMiddleware();
applicationServer.useExpressSession(sessionOptions);
applicationServer.Application.use(initialize());
applicationServer.Application.use(passportSession());
applicationServer.Application.use(sessionAuthenticationChecker);
applicationServer.Application.use('/operations', operationsRouter);
applicationServer.Application.use('/push', pushNotificationsRouter);

setupUserDeSerialization();
setupEmailAndPasswordAuthentication();
setupFacebookAuthentication();
setupTwitterAuthentication();

authenticationServer.start();

applicationServer.start();
