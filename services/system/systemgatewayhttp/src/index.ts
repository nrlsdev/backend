import { Server } from '@backend/server';
import { SystemConfiguration } from '@backend/systemconfiguration';
import { v4 as uuid } from 'uuid';
import expressSession, { SessionOptions } from 'express-session';
import { initialize, session as passportSession } from 'passport';
import MongoStore from 'connect-mongodb-session';
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
const {
  jsonWebTokenSecret,
  jsonWebTokenLifetime,
} = SystemConfiguration.systemAuthentication;
const authenticationServer: Server = new Server(
  authenticationHost,
  authenticationPort,
  true,
);
const systemServer: Server = new Server(systemHost, systemPort, true);
const Store = MongoStore(expressSession);
const session: SessionOptions = {
  genid: () => {
    return uuid();
  },
  secret: jsonWebTokenSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: Number(jsonWebTokenLifetime),
    httpOnly: true,
    secure: true,
  },
  store: new Store({
    uri: 'mongodb://devdb:devdb@ckc3fp0ra5nyqrct.myfritz.net:37011/devdb', // ToDo: Get database url
    collection: 'system_user_sessions', // ToDo: set name in config
  }),
};

authenticationServer.useCorsMiddleware({
  origin: true, // ToDo: whitelisted domains (custom middleware): https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express
  credentials: true,
});
authenticationServer.useJsonMiddleware();
authenticationServer.useLanguageMiddleware();
authenticationServer.useCookieParserMiddleware();
authenticationServer.Application.use(expressSession(session));
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
systemServer.Application.use(expressSession(session));
systemServer.Application.use(initialize());
systemServer.Application.use(passportSession());
systemServer.Application.use(sessionAuthenticationChecker);

systemServer.Application.use('/systemuser', systemuserRouter);
systemServer.Application.use('/application', applicationRouter);

authenticationServer.start();

systemServer.start();
