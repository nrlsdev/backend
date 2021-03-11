import { Server } from '@backend/server';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { initialize, session } from 'passport';
import { ServerSessionOptions } from '@backend/server/src/server';
import {
  publicAuthenticationRouter,
  privateAuthenticationRouter,
} from './authentication/authentication-router';
import {
  sessionAuthenticationChecker,
  setupUserDeSerialization,
} from './authentication/session/session';
import { setupEmailAndPasswordAuthentication } from './authentication/email-and-password/email-and-password-controller';

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
authenticationServer.Application.use(session());

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
applicationServer.Application.use(session());
applicationServer.Application.use(sessionAuthenticationChecker);

setupUserDeSerialization();
setupEmailAndPasswordAuthentication();

authenticationServer.start();

applicationServer.start();
