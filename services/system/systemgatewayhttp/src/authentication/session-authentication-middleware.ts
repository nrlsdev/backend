import { Request, Response, NextFunction } from 'express';
import { ErrorMessage } from '@backend/systemmessagefactory';
import { ResponseMessage } from '@backend/messagehandler';

export const sessionAuthenticationChecker = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (!request.isAuthenticated()) {
    const responseMessage: ResponseMessage = ErrorMessage.unauthorizedErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();

    return;
  }

  request.body.userId = (request.session as any).passport.user._id;
  request.body.userEmail = (request.session as any).passport.user.email;

  next();
};
