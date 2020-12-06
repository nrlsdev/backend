import { Server } from '@backend/server';
import { authenticationRouter } from './authentication/authentication-router';

const authenticationServer: Server = new Server('', 8082);

authenticationServer.Application.use('/auth', authenticationRouter);

authenticationServer.start();
