import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server, ServerSessionOptions, StatusCodes } from '@backend/server';
import { Logger } from '@backend/logger';
import { ErrorMessage, OperationsMessage } from '@backend/applicationmessagefactory';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { MessageQueueType, MessageSeverityType, ResponseMessage } from '@backend/messagehandler';
import { messageManager } from './message-manager';

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

    // eslint-disable-next-line no-param-reassign
    client.data.user = user;

    next();
  });
});

webSocketServer.on('connection', onWebSocketServerConnection);

function onWebSocketServerConnection(client: Socket) {
  logger.info('connection', 'Client connected.');

  client.on('message', (message: string) => {
    onWebSocketServerMessage(message, client);
  });

  client.on('disconnect', onWebSocketServerDisconnect);
}

async function onWebSocketServerMessage(message: string, client: Socket) {
  let jsonObject: any = {};
  try {
    jsonObject = JSON.parse(JSON.stringify(message));
  } catch {
    logger.error('onWebSocketServerMessage', 'No Json object.');

    return;
  }

  const { method, collection } = jsonObject;
  const messageIdentifier = jsonObject.messageIdentifier ?? '';

  const userId: string = client.data.user._id;
  let responseMessage: ResponseMessage;

  logger.debug('onWebSocketServerMessage', `New '${method}' message received.`);

  switch (method) {
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_POST: {
      const { data } = jsonObject;

      if (!collection || !data || !userId) {
        responseMessage = ErrorMessage.unprocessableEntityErrorResponse();

        break;
      }

      responseMessage = await messageManager.sendReplyToMessage(
        OperationsMessage.postRequest(collection, data, userId),
        MessageQueueType.APPLICATION_DBCONNECTOR,
        MessageSeverityType.APPLICATION_OPERATIONS,
      );

      sendBrodcastUpdateMessages(responseMessage, client, messageIdentifier);

      return;
    }
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_GET: {
      const { entities, selectAll } = jsonObject;

      if (!collection || !userId) {
        responseMessage = ErrorMessage.unprocessableEntityErrorResponse();

        break;
      }

      responseMessage = await messageManager.sendReplyToMessage(
        OperationsMessage.getRequest(collection, entities, selectAll, userId),
        MessageQueueType.APPLICATION_DBCONNECTOR,
        MessageSeverityType.APPLICATION_OPERATIONS,
      );

      break;
    }
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_PUT: {
      const { data, objectId } = jsonObject;

      if (!collection || !objectId || !data || !userId) {
        responseMessage = ErrorMessage.unprocessableEntityErrorResponse();

        break;
      }

      responseMessage = await messageManager.sendReplyToMessage(
        OperationsMessage.putRequest(collection, data, objectId, userId),
        MessageQueueType.APPLICATION_DBCONNECTOR,
        MessageSeverityType.APPLICATION_OPERATIONS,
      );

      sendBrodcastUpdateMessages(responseMessage, client, messageIdentifier);

      return;
    }
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_DELETE: {
      const { objectId } = jsonObject;

      if (!collection || !objectId || !userId) {
        responseMessage = ErrorMessage.unprocessableEntityErrorResponse();

        break;
      }

      responseMessage = await messageManager.sendReplyToMessage(
        OperationsMessage.deleteRequest(collection, objectId, userId),
        MessageQueueType.APPLICATION_DBCONNECTOR,
        MessageSeverityType.APPLICATION_OPERATIONS,
      );

      sendBrodcastUpdateMessages(responseMessage, client, messageIdentifier);

      return;
    }
    default: {
      logger.error('onWebSocketServerMessage', `Could not handle webservice message of type '${method}'`);

      responseMessage = ErrorMessage.badRequestErrorResponse(`Could not handle webservice message of type '${method}'`);

      break;
    }
  }

  sendMessage(responseMessage, client, 'message', messageIdentifier);
}

function sendMessage(responseMessage: ResponseMessage, client: Socket, message: string, messageIdentifier: String) {
  const messageIdentifierName: string = message === 'update' ? 'update' : `${message}${!messageIdentifier ? '' : `_${messageIdentifier}`}`;

  if (!responseMessage.body.data) {
    client.emit(messageIdentifierName, responseMessage);

    return;
  }

  client.emit(messageIdentifierName, responseMessage);
}

function sendBrodcastUpdateMessages(responseMessage: ResponseMessage, sender: Socket, messageIdentifier: String) {
  if (responseMessage.meta.statusCode !== StatusCodes.OK) {
    sendMessage(responseMessage, sender, 'message', messageIdentifier);

    return;
  }

  const { data }: any = responseMessage.body;

  if (!data || !data.result) {
    sendMessage(responseMessage, sender, 'message', messageIdentifier);

    return;
  }

  webSocketServer.sockets.sockets.forEach((client: Socket) => {
    sendMessage(responseMessage, client, client.id === sender.id ? 'message' : 'update', messageIdentifier);
  });
}

function onWebSocketServerDisconnect() {
  logger.info('connection', 'Client disconnected.');
}

messageServer.start();
