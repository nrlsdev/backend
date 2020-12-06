import { Server } from '@backend/server';

const authenticationServer: Server = new Server('', 8082);

authenticationServer.start();
