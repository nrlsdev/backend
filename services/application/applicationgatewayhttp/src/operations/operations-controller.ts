import { ErrorMessage, OperationsMessage } from '@backend/applicationmessagefactory';
import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response } from '@backend/server';
import { messageManager } from '../message-manager';

export async function dbPost(request: Request, response: Response) {
  const { collection, data, userPermissions, userId } = request.body;

  if (!collection || !data || !userPermissions || !userId) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response.status(errorResponseMessage.meta.statusCode).send(errorResponseMessage).end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.postRequest(collection, data, userPermissions, userId),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function dbGet(request: Request, response: Response) {
  const { collection, query, fields, includeFields, userId } = request.body;

  if (!collection || !query || !fields || includeFields === undefined || !userId) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response.status(errorResponseMessage.meta.statusCode).send(errorResponseMessage).end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.getRequest(collection, query, fields, includeFields, userId),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function dbPut(request: Request, response: Response) {
  const { collection, data, objectId, userId } = request.body;

  if (!collection || !data || !objectId || !userId) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response.status(errorResponseMessage.meta.statusCode).send(errorResponseMessage).end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.putRequest(collection, data, objectId, userId),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function dbDelete(request: Request, response: Response) {
  const { collection, objectId, userId } = request.body;

  if (!collection || !objectId || !userId) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response.status(errorResponseMessage.meta.statusCode).send(errorResponseMessage).end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.deleteRequest(collection, objectId, userId),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
