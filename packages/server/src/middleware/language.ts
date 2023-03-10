import { Constants } from '@backend/constants';
import { Request, Response, NextFunction } from 'express';

export const language = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { headers } = request;
  if (!headers) {
    request.body.languageCode = Constants.DEFAULT_LANGUAGE_CODE;
    next();
    return;
  }
  const languageCode: string = request.headers[
    Constants.HTTP_HEADER_CONTENT_LANGUAGE
  ] as string;

  if (!languageCode) {
    request.body.languageCode = Constants.DEFAULT_LANGUAGE_CODE;
    next();
    return;
  }
  request.body.languageCode = languageCode;
  next();
};
