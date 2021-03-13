import { OperationsMessage } from '@backend/applicationmessagefactory';
import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response } from '@backend/server';
import { messageManager } from '../message-manager';

export async function dbPost(request: Request, response: Response) {
  const { collection, data } = request.body;
  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.postRequest(collection, data),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function dbGet(request: Request, response: Response) {
  const { collection, queryObject, fields } = request.body;
  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.getRequest(collection, queryObject, fields || []),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function dbPut(request: Request, response: Response) {
  const { collection, queryObject, updateObject } = request.body;
  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.putRequest(collection, queryObject, updateObject),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function dbDelete(request: Request, response: Response) {
  const { collection, queryObject } = request.body;
  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.deleteRequest(collection, queryObject),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
