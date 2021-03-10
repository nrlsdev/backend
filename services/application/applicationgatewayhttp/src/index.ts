import { Server } from '@backend/server';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { publicAuthenticationRouter } from './authentication/authentication-router';

const { applicationgatewayhttp } = ApplicationConfiguration;
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

authenticationServer.useCorsMiddleware({
  origin: true, // ToDo: whitelisted domains (custom middleware): https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express
  credentials: true,
});
authenticationServer.useJsonMiddleware();
authenticationServer.useLanguageMiddleware();
authenticationServer.useCookieParserMiddleware();

authenticationServer.Application.use('/auth', publicAuthenticationRouter);

applicationServer.useCorsMiddleware({
  origin: true, // ToDo: whitelisted domains (custom middleware): https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express
  credentials: true,
});
applicationServer.useJsonMiddleware();
applicationServer.useLanguageMiddleware();
applicationServer.useCookieParserMiddleware();

authenticationServer.start();

applicationServer.start();
