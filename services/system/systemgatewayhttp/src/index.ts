import { Server } from '@backend/server';
import { authenticationRouter } from './authentication/authentication-router';

const authenticationServer: Server = new Server('', 8082);
const systemServer: Server = new Server('', 8083);

authenticationServer.Application.use('/auth', authenticationRouter);

authenticationServer.start();
systemServer.start();
