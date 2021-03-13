import { OperationsMessage } from '@backend/applicationmessagefactory';
import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { messageManager } from '../message-manager';

export async function dbPost(collection: string, data: any) {
  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.postRequest(collection, data),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  return responseMessage;
}

export async function dbGet(
  collection: string,
  queryObject: any,
  fields: string[] = [],
) {
  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.getRequest(collection, queryObject, fields),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  return responseMessage;
}

export async function dbPut(
  collection: string,
  queryObject: any,
  updateObject: any,
) {
  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.putRequest(collection, queryObject, updateObject),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  return responseMessage;
}

export async function dbDelete(collection: string, queryObject: any) {
  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.deleteRequest(collection, queryObject),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  return responseMessage;
}
