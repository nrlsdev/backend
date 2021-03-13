import WebSocket, { Server as WebSocketServer } from 'ws';
import { Logger } from '@backend/logger';
import {
  ErrorMessage,
  OperationsMessage,
} from '@backend/applicationmessagefactory';
import {
  dbDelete,
  dbGet,
  dbPost,
  dbPut,
} from '../operations/operations-controller';
import { StatusCodes } from '../../../../../packages/applicationmessagefactory/node_modules/@backend/server';

const logger: Logger = new Logger('websocket');
const webSocketServer: WebSocketServer = new WebSocketServer({
  host: '192.168.178.36', // ToDo: Config
  port: 8086, // ToDo: Config
  path: '/applicationId', // ToDo: Config
});

export function startWebSocketServer() {
  logger.info(
    'startWebSocketServer',
    'Server listening on https://192.168.178.36:8084',
  ); // ToDo: Config

  webSocketServer.on('connection', onWebSocketServerConnection);
}

function onWebSocketServerConnection(webSocket: WebSocket) {
  logger.info(
    'onWebSocketServerConnection',
    `Client connected ('${webSocketServer.clients.size}' clients connected).`,
  );

  webSocket.on('message', async (message: any) => {
    handleWebSocketServerMessage(webSocket, message);
  });

  webSocket.on('close', onWebSocketServerClose);
}

async function handleWebSocketServerMessage(
  webSocket: WebSocket,
  message: any,
) {
  let jsonMessage: any = null;

  try {
    jsonMessage = JSON.parse(message);
  } catch (exception) {
    webSocket.send(
      JSON.stringify(
        ErrorMessage.unprocessableEntityErrorResponse(
          'Could not parse message (Must be a JSON).',
        ),
      ),
    );

    return;
  }

  const { method, collection } = jsonMessage;

  if (!method || !collection) {
    webSocket.send(
      JSON.stringify(
        ErrorMessage.unprocessableEntityErrorResponse(
          'Method and/or collection parameters are missing.',
        ),
      ),
    );

    return;
  }

  let responseMessage: any = null;

  switch (method) {
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_POST: {
      responseMessage = await dbPost(collection, jsonMessage.data);
      break;
    }
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_GET: {
      responseMessage = await dbGet(
        collection,
        jsonMessage.queryObject,
        jsonMessage.fields,
      );
      break;
    }
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_PUT: {
      responseMessage = await dbPut(
        collection,
        jsonMessage.queryObject,
        jsonMessage.updateObject,
      );
      break;
    }
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_DELETE: {
      responseMessage = await dbDelete(collection, jsonMessage.queryObject);
      break;
    }
    default: {
      webSocket.send(
        JSON.stringify(
          ErrorMessage.errorResponse(
            StatusCodes.BAD_REQUEST,
            `Could not handle message method '${method}'.`,
          ),
        ),
      );

      return;
    }
  }

  if (!responseMessage) {
    webSocket.send(
      JSON.stringify(
        ErrorMessage.errorResponse(
          StatusCodes.BAD_REQUEST,
          'Could not handle message.',
        ),
      ),
    );

    return;
  }

  webSocket.send(JSON.stringify(responseMessage));
}

function onWebSocketServerClose() {
  logger.info(
    'onWebSocketServerClose',
    `Client disconnected ('${webSocketServer.clients.size}' clients connected).`,
  );
}
