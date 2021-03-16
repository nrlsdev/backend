import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server, ServerSessionOptions } from '@backend/server';
import { Logger } from '@backend/logger';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';

const logger: Logger = new Logger('applicationgatewaymsg-index');
const messageServer: Server = new Server('192.168.178.36', 8086, true);
const webSocketServer = new SocketIOServer(messageServer.Server);
const { applicationSession, applicationdbconnector } = ApplicationConfiguration;
const sessionOptions: ServerSessionOptions = {
  secret: applicationSession.secret,
  resave: applicationSession.resave,
  saveUninitialized: applicationSession.saveUninitialized,
  cookie: {
    maxAge: Number(applicationSession.cookieMaxAge),
    httpOnly: applicationSession.cookieHttpOnly,
    secure: applicationSession.cookieSecure,
  },
  mongoSessionStorage: {
    uri: `
      mongodb://${applicationdbconnector.dbUsername}:${applicationdbconnector.dbPassword}@${applicationdbconnector.dbHost}:${applicationdbconnector.dbPort}/${applicationdbconnector.dbName}
      `, // ToDo: DB String generator
    collection: applicationSession.mongoStorageCollection,
  },
};

messageServer.useExpressSession(sessionOptions);
webSocketServer.use((client, next) => {
  messageServer.Session(client.request, {}, () => {
    const { session } = client.request as any;
    if (!session) {
      next(new Error('No valid Session (Unauthorized).'));

      return;
    }
    const { passport } = session;
    if (!passport) {
      next(new Error('No valid Session (Unauthorized).'));

      return;
    }
    const { user } = passport;
    if (!user) {
      next(new Error('No valid Session (Unauthorized).'));

      return;
    }
    if (!user._id && (!user.email || !user.facebook || !user.twitter)) {
      next(new Error('No valid Session (Unauthorized).'));

      return;
    }
    next();
  });
});

webSocketServer.on('connection', onWebSocketServerConnection);

function onWebSocketServerConnection(client: Socket) {
  logger.info('connection', 'Client connected.');

  client.on('message', (message: string) => {
    const result = checkSession(client.request);

    if (result) {
      client.emit(
        'message',
        JSON.stringify(
          ErrorMessage.errorResponse(StatusCodes.UNAUTHORIZED, result.message),
        ),
      );

      return;
    }

    onWebSocketServerMessage(message, client);
  });

  client.on('disconnect', onWebSocketServerDisconnect);
}

function onWebSocketServerMessage(_message: string) {
  logger.debug('onWebSocketServerMessage', 'New message received.');
}

function onWebSocketServerDisconnect() {
  logger.info('connection', 'Client disconnected.');
}

messageServer.start();
