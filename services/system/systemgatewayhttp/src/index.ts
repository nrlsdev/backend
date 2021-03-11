import { Server } from '@backend/server';
import { SystemConfiguration } from '@backend/systemconfiguration';
import { initialize, session as passportSession } from 'passport';
import { ServerSessionOptions } from '@backend/server/src/server';
import { applicationRouter } from './application/application-router';
import { systemuserRouter } from './systemuser/systemuser-router';
import { setupLocalAuthentication } from './authentication/authentication-controller';
import { sessionAuthenticationChecker } from './authentication/session-authentication-middleware';
import { publicAuthenticationRouter } from './authentication/public-authentication-router';
import { privateAuthenticationRouter } from './authentication/private-authentication-router';

const {
  authenticationHost,
  authenticationPort,
  systemHost,
  systemPort,
} = SystemConfiguration.systemgatewayhttp;
const { systemdbconnector, systemSession } = SystemConfiguration;
const authenticationServer: Server = new Server(
  authenticationHost,
  authenticationPort,
  true,
);
const systemServer: Server = new Server(systemHost, systemPort, true);
const sessionOptions: ServerSessionOptions = {
  secret: systemSession.secret,
  resave: systemSession.resave,
  saveUninitialized: systemSession.saveUninitialized,
  cookie: {
    maxAge: Number(systemSession.cookieMaxAge),
    httpOnly: systemSession.cookieHttpOnly,
    secure: systemSession.cookieSecure,
  },
  mongoSessionStorage: {
    uri: `
    mongodb://${systemdbconnector.dbUsername}:${systemdbconnector.dbPassword}@${systemdbconnector.dbHost}:${systemdbconnector.dbPort}/${systemdbconnector.dbName}
    `, // ToDo: DB String generator
    collection: systemSession.mongoStorageCollection,
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

setupLocalAuthentication();

authenticationServer.Application.use('/auth', publicAuthenticationRouter);
authenticationServer.Application.use(sessionAuthenticationChecker);
authenticationServer.Application.use('/auth', privateAuthenticationRouter);

systemServer.useCorsMiddleware({
  origin: true, // ToDo: whitelisted domains (custom middleware): https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express
  credentials: true,
});
systemServer.useJsonMiddleware();
systemServer.useLanguageMiddleware();
systemServer.useCookieParserMiddleware();
systemServer.useExpressSession(sessionOptions);
systemServer.Application.use(initialize());
systemServer.Application.use(passportSession());
systemServer.Application.use(sessionAuthenticationChecker);

systemServer.Application.use('/systemuser', systemuserRouter);
systemServer.Application.use('/application', applicationRouter);

authenticationServer.start();

systemServer.start();
