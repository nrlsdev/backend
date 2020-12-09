import { decode, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from '@backend/server';
import { ErrorMessage } from '@backend/systemmessagefactory';
import { ResponseMessage } from '@backend/messagehandler';

export const checkToken = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { headers } = request;

  const token: string =
    request.body.token ||
    request.query.token ||
    headers['x-access-token'] ||
    headers.authorization?.replace(/^Bearer\s/, '');

  if (!token) {
    const responseMessage: ResponseMessage = ErrorMessage.forbiddenErrorResponse(
      'No authentication token provided.',
    );

    response.status(responseMessage.meta.statusCode).send();
    return;
  }
  // ToDo: Tokenn secret
  if (!validateToken(token, 'TOKEN - SECRET OR KEY')) {
    const responseMessage: ResponseMessage = ErrorMessage.unauthorizedErrorResponse(
      'No valid authentication token.',
    );

    response.status(responseMessage.meta.statusCode).send(responseMessage);
    return;
  }

  const { _id, email } = decode(token) as any;

  request.body.tokenUserId = _id;
  request.body.tokenEmail = email;

  next();
};

function validateToken(token: string, secretOrKey: string) {
  try {
    verify(token, secretOrKey);
  } catch (exception) {
    return false;
  }

  return true;
}
