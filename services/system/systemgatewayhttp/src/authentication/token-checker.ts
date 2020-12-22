import { decode, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from '@backend/server';
import { ErrorMessage } from '@backend/systemmessagefactory';
import { ResponseMessage } from '@backend/messagehandler';
import { SystemConfiguration } from '@backend/systemconfiguration';

export const checkToken = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { token } = request.cookies;

  if (!token) {
    const responseMessage: ResponseMessage = ErrorMessage.forbiddenErrorResponse(
      'No authentication token provided.',
    );

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();
    return;
  }

  if (
    !validateToken(
      token,
      SystemConfiguration.systemAuthentication.jsonWebTokenSecret,
    )
  ) {
    const responseMessage: ResponseMessage = ErrorMessage.unauthorizedErrorResponse(
      'No valid authentication token.',
    );

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();
    return;
  }

  const { _id, email } = decode(token) as any;

  request.body.userId = _id;
  request.body.userEmail = email;

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
