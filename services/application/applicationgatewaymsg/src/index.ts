import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server } from '@backend/server';
import { Logger } from '@backend/logger';

const logger: Logger = new Logger('applicationgatewaymsg-index');
const messageServer: Server = new Server('192.168.178.36', 8086, true);
const webSocketServer = new SocketIOServer(messageServer.Server);

webSocketServer.on('connection', onWebSocketServerConnection);

function onWebSocketServerConnection(client: Socket) {
  logger.info('connection', 'Client connected.');

  client.on('message', onWebSocketServerMessage);

  client.on('disconnect', onWebSocketServerDisconnect);
}

function onWebSocketServerMessage(message: string) {
  logger.info('message', 'Message received');
  console.log(message);
}

function onWebSocketServerDisconnect() {
  logger.info('connection', 'Client disconnected.');
}

messageServer.start();
