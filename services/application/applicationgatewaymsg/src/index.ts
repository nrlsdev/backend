import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server, ServerSessionOptions, StatusCodes } from '@backend/server';
import { Logger } from '@backend/logger';
import { ErrorMessage, OperationsMessage } from '@backend/applicationmessagefactory';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { MessageQueueType, MessageSeverityType, ResponseMessage } from '@backend/messagehandler';
import { copyObject, DynamicEntity, Permission, PermissionEntity } from '@backend/applicationinterfaces';
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
  const userId: string = client.data.user._id;
  let responseMessage: ResponseMessage;

  logger.debug('onWebSocketServerMessage', `New '${method}' message received.`);

  switch (method) {
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_POST: {
      const { data, userPermissions } = jsonObject;

      responseMessage = await messageManager.sendReplyToMessage(
        OperationsMessage.postRequest(collection, data, userPermissions, userId),
        MessageQueueType.APPLICATION_DBCONNECTOR,
        MessageSeverityType.APPLICATION_OPERATIONS,
      );

      sendBrodcastUpdateMessages(responseMessage, client);

      return;
    }
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_GET: {
      const { query, fields, includeFields } = jsonObject;

      responseMessage = await messageManager.sendReplyToMessage(
        OperationsMessage.getRequest(collection, query, fields, includeFields, userId),
        MessageQueueType.APPLICATION_DBCONNECTOR,
        MessageSeverityType.APPLICATION_OPERATIONS,
      );

      break;
    }
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_PUT: {
      const { data, objectId } = jsonObject;

      responseMessage = await messageManager.sendReplyToMessage(
        OperationsMessage.putRequest(collection, data, objectId, userId),
        MessageQueueType.APPLICATION_DBCONNECTOR,
        MessageSeverityType.APPLICATION_OPERATIONS,
      );

      sendBrodcastUpdateMessages(responseMessage, client);

      return;
    }
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_DELETE: {
      const { objectId } = jsonObject;

      responseMessage = await messageManager.sendReplyToMessage(
        OperationsMessage.deleteRequest(collection, objectId, userId),
        MessageQueueType.APPLICATION_DBCONNECTOR,
        MessageSeverityType.APPLICATION_OPERATIONS,
      );

      sendBrodcastUpdateMessages(responseMessage, client);

      return;
    }
    default: {
      logger.error('onWebSocketServerMessage', `Could not handle webservice message of type '${method}'`);

      responseMessage = ErrorMessage.badRequestErrorResponse(`Could not handle webservice message of type '${method}'`);

      break;
    }
  }

  sendUpdateMessage(responseMessage, client);
}

function sendUpdateMessage(responseMessage: ResponseMessage, client: Socket) {
  const { result }: { result: DynamicEntity } = responseMessage.body.data as any;
  const copyOfResponseMessage = copyObject(responseMessage);
  const userId: string = client.data.user._id;

  if (!PermissionEntity.isUserPermitted(result.userPermissions, userId, Permission.READ)) {
    return;
  }

  const copyObjectResult = copyOfResponseMessage.body.data.result;

  if (copyObjectResult.length) {
    copyObjectResult.forEach((copiedObject: any) => {
      // eslint-disable-next-line no-param-reassign
      delete copiedObject.userPermissions;
    });
  } else {
    // eslint-disable-next-line no-param-reassign
    delete copyObjectResult.userPermissions;
  }
  delete copyOfResponseMessage.body.data.result.userPermissions

  client.emit('update', copyOfResponseMessage);
}

function sendBrodcastUpdateMessages(responseMessage: ResponseMessage, client: Socket) {
  if (responseMessage.meta.statusCode !== StatusCodes.OK) {
    sendUpdateMessage(responseMessage, client);

    return;
  }

  const { data }: any = responseMessage.body;

  if (!data || !data.result) {
    sendUpdateMessage(responseMessage, client);

    return;
  }

  webSocketServer.sockets.sockets.forEach((socket: Socket) => {
    sendUpdateMessage(responseMessage, socket);
  });
}

function onWebSocketServerDisconnect() {
  logger.info('connection', 'Client disconnected.');
}

messageServer.start();
