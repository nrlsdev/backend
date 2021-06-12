import { ErrorMessage, OperationsMessage } from '@backend/applicationmessagefactory';
import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response } from '@backend/server';
import { messageManager } from '../message-manager';

export async function dbPost(request: Request, response: Response) {
  const { collection, data, userId, custom } = request.body;

  if (!collection || !data || !userId) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response.status(errorResponseMessage.meta.statusCode).send(errorResponseMessage).end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.postRequest(collection, data, userId, custom),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function dbGet(request: Request, response: Response) {
  const { collection, entities, query, selectAll, userId, custom } = request.body;

  if (!collection || !userId) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response.status(errorResponseMessage.meta.statusCode).send(errorResponseMessage).end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.getRequest(collection, entities, query, selectAll, userId, custom),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function dbPut(request: Request, response: Response) {
  const { collection, data, objectId, userId, custom } = request.body;

  if (!collection || !data || !objectId || !userId) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response.status(errorResponseMessage.meta.statusCode).send(errorResponseMessage).end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.putRequest(collection, data, objectId, userId, custom),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function dbDelete(request: Request, response: Response) {
  const { collection, objectId, userId, custom } = request.body;

  if (!collection || !objectId || !userId) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response.status(errorResponseMessage.meta.statusCode).send(errorResponseMessage).end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.deleteRequest(collection, objectId, userId, custom),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
