import { Server } from '@backend/server';
import { authenticationRouter } from './authentication/authentication-router';
import { checkToken } from './authentication/token-checker';

const authenticationServer: Server = new Server('', 8082);
const systemServer: Server = new Server('', 8083);

authenticationServer.Application.use('/auth', authenticationRouter);
systemServer.Application.use(checkToken);

authenticationServer.start();
systemServer.start();
