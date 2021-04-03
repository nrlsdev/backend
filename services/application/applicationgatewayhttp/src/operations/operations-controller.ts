import { copyObject } from '@backend/applicationinterfaces';
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
  const responseMessageWithoutPermissions: ResponseMessage = removeUserPermissionsFromResponse(responseMessage);

  response.status(responseMessageWithoutPermissions.meta.statusCode).send(responseMessageWithoutPermissions).end();
}

export async function dbGet(request: Request, response: Response) {
  const { collection, entities, selectAll, userId } = request.body;

  if (!collection || !userId) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response.status(errorResponseMessage.meta.statusCode).send(errorResponseMessage).end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.getRequest(collection, entities, selectAll, userId),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );
  const responseMessageWithoutPermissions: ResponseMessage = removeUserPermissionsFromResponse(responseMessage);

  response.status(responseMessageWithoutPermissions.meta.statusCode).send(responseMessageWithoutPermissions).end();
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
  const responseMessageWithoutPermissions: ResponseMessage = removeUserPermissionsFromResponse(responseMessage);

  response.status(responseMessageWithoutPermissions.meta.statusCode).send(responseMessageWithoutPermissions).end();
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
  const responseMessageWithoutPermissions: ResponseMessage = removeUserPermissionsFromResponse(responseMessage);

  response.status(responseMessageWithoutPermissions.meta.statusCode).send(responseMessageWithoutPermissions).end();
}

export async function dbChangePermissions(request: Request, response: Response) {
  const { collection, objectId, userPermissions, userId } = request.body;

  if (!collection || !objectId || !userPermissions || !userId) {
    const errorResponseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response.status(errorResponseMessage.meta.statusCode).send(errorResponseMessage).end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    OperationsMessage.changePermissionRequest(collection, objectId, userPermissions, userId),
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

function removeUserPermissionsFromResponse(responseMessage: ResponseMessage) {
  const copyOfResponseMessage = copyObject(responseMessage);
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

  delete copyOfResponseMessage.body.data.result.userPermissions;

  return copyOfResponseMessage as ResponseMessage;
}
