import { Request, Response, NextFunction } from '../../index';

export const language = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const languageCode: string = request.headers['content-language'] as string;

  if (!languageCode) {
    request.body.languageCode = 'en-US'; // ToDo: default
    next();
    return;
  }
  request.body.languageCode = languageCode;
  next();
};
