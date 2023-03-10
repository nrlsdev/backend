import { ResponseMessage } from '@backend/messagehandler';
import { Request, Response, StatusCodes } from '@backend/server';

export function signOut(request: Request, response: Response) {
  request.logout();

  const responseMessage: ResponseMessage = {
    meta: {
      statusCode: StatusCodes.OK,
    },
    body: {},
  };

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export function isAuthenticated(_request: Request, response: Response) {
  const responseMessage: ResponseMessage = {
    meta: {
      statusCode: StatusCodes.OK,
    },
    body: {},
  };

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}
