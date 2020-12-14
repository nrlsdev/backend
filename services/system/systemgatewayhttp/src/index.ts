import { Server } from '@backend/server';
import { SystemConfiguration } from '@backend/systemconfiguration';
import { authenticationRouter } from './authentication/auth/authentication-router';
import { validationRouter } from './authentication/validate/validate-router';
import { checkToken } from './authentication/token-checker';
import { systemuserRouter } from './systemuser/systemuser-router';

const {
  authenticationHost,
  authenticationPort,
  systemHost,
  systemPort,
} = SystemConfiguration.systemgatewayhttp;
const authenticationServer: Server = new Server(
  authenticationHost,
  authenticationPort,
);
const systemServer: Server = new Server(systemHost, systemPort);

authenticationServer.useJsonMiddleware();
authenticationServer.useLanguageMiddleware();
authenticationServer.useCookieParserMiddleware();
authenticationServer.useCorsMiddleware({
  origin: true, // ToDo: whitelisted domains (custom middleware): https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express
  credentials: true,
});

systemServer.useJsonMiddleware();
systemServer.useLanguageMiddleware();
systemServer.useCookieParserMiddleware();
systemServer.useCorsMiddleware({
  origin: true, // ToDo: whitelisted domains (custom middleware): https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express
  credentials: true,
});

authenticationServer.Application.use('/auth', authenticationRouter);
authenticationServer.Application.use(checkToken);
authenticationServer.Application.use('/validate', validationRouter);

systemServer.Application.use(checkToken);
systemServer.Application.use('/systemuser', systemuserRouter);

authenticationServer.start();

systemServer.start();
