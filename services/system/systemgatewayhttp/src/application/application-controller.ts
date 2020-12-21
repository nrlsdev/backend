import {
  ResponseMessage,
  MessageQueueType,
  MessageSeverityType,
} from '@backend/messagehandler';
import { Request, Response, StatusCodes } from '@backend/server';
import { Application } from '@backend/systeminterfaces';
import { ApplicationMessage } from '@backend/systemmessagefactory';
import { messageManager } from '../message-manager';

export async function createApplication(request: Request, response: Response) {
  const { bundleId, name } = request.body;
  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationMessage.createApplicationRequest(bundleId, name),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  response.status(responseMessage.meta.statusCode);
  response.send(responseMessage).end();
}

async function getAllApplicationsResponseUserHasAuthorizationFor(
  request: Request,
) {
  const { tokenUserId } = request.body;

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    ApplicationMessage.getAllApplicationsUserHasAuthorizationForRequest(
      tokenUserId,
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
  );

  return responseMessage;
}

export async function getAllApplicationsUserHasAuthorizationFor(
  request: Request,
  response: Response,
) {
  const responseMessage: ResponseMessage = await getAllApplicationsResponseUserHasAuthorizationFor(
    request,
  );

  response.status(responseMessage.meta.statusCode);
  response.send(responseMessage).end();
}

export async function getApplicationById(request: Request, response: Response) {
  const responseDatabaseMessage: ResponseMessage = await getAllApplicationsResponseUserHasAuthorizationFor(
    request,
  );
  const { data }: any = responseDatabaseMessage.body;

  if (!data) {
    return;
  }

  const id: string = request.params.id as string;
  const applications = data.applications as Application[];
  let application: Application | null = null;

  applications.forEach((app) => {
    if (app._id === id) {
      application = app;
    }
  });

  let responseMessage: ResponseMessage;

  if (application) {
    responseMessage = ApplicationMessage.getApplicationByIdResponse(
      StatusCodes.OK,
      application,
    );
  } else {
    responseMessage = ApplicationMessage.getApplicationByIdResponse(
      StatusCodes.NOT_FOUND,
      undefined,
      `No Application with Id '${id}' found.`,
    );
  }

  response.status(responseMessage.meta.statusCode);
  response.send(responseMessage).end();
}
