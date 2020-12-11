import { Server } from '@backend/server';
import { authenticationRouter } from './authentication/auth/authentication-router';
import { validationRouter } from './authentication/validate/validate-router';
import { checkToken } from './authentication/token-checker';

const authenticationServer: Server = new Server('', 8082);
const systemServer: Server = new Server('', 8083);

authenticationServer.useJsonMiddleware();
authenticationServer.useLanguageMiddleware();
authenticationServer.useCookieParserMiddleware();
authenticationServer.useCorsMiddleware({
  origin: 'http://localhost:8002',
  credentials: true,
});

systemServer.useJsonMiddleware();
systemServer.useLanguageMiddleware();
systemServer.useCookieParserMiddleware();
systemServer.useCorsMiddleware({
  origin: 'http://localhost:8003',
  credentials: true,
});

authenticationServer.Application.use('/auth', authenticationRouter);
authenticationServer.Application.use(checkToken);
authenticationServer.Application.use('/validate', validationRouter);

systemServer.Application.use(checkToken);

authenticationServer.start();

systemServer.start();
