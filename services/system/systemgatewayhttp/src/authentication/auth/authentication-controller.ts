import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response, StatusCodes } from '@backend/server';
import { ErrorMessage, SystemUserMessage } from '@backend/systemmessagefactory';
import { sign, decode } from 'jsonwebtoken';
import { Logger } from '@backend/logger';
import { SystemConfiguration } from '@backend/systemconfiguration';
import { Constants } from '@backend/constants';
import { messageManager } from '../../message-manager';

const logger: Logger = new Logger('authentication-controller');
const {
  jsonWebTokenSecret,
  jsonWebTokenLifetime,
  refreshTokenSecret,
  refreshTokenLifetime,
} = SystemConfiguration.systemAuthentication;
const tokenList: { [id: string]: string } = {};

export async function onUserSignUp(request: Request, response: Response) {
  const { email, firstname, lastname, password } = request.body;

  if (!email || !firstname || !lastname || !password) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();

    return;
  }

  const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    SystemUserMessage.createSystemUserRequest(
      email,
      firstname,
      lastname,
      password,
    ),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_USER,
  );

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function onUserSignIn(request: Request, response: Response) {
  const { email, password } = request.body;

  if (!email || !password) {
    const responseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();

    return;
  }

  const databaseResponseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
    SystemUserMessage.signInSystemUserRequest(email, password),
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_USER,
  );

  if (databaseResponseMessage.meta.statusCode !== StatusCodes.OK) {
    response
      .status(databaseResponseMessage.meta.statusCode)
      .send(databaseResponseMessage)
      .end();
    return;
  }

  const { data }: any = databaseResponseMessage.body;

  const token = generateJWTToken(data._id, data.email);
  const refreshToken = generateRefreshToken(data._id, data.email);

  const responseMessage: ResponseMessage = SystemUserMessage.signedInSystemUserResponse(
    StatusCodes.OK,
  );

  response.cookie(Constants.JSON_WEB_TOKEN_COOKIE_NAME, token, {
    expires: new Date(new Date().getTime() + +jsonWebTokenLifetime),
    httpOnly: true,
  });

  response.cookie(Constants.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    expires: new Date(new Date().getTime() + +refreshTokenLifetime),
    httpOnly: true,
  });

  tokenList[refreshToken] = token;

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export function onUserSignOut(_request: Request, response: Response) {
  response.cookie(Constants.JSON_WEB_TOKEN_COOKIE_NAME, '', {
    expires: new Date(),
    httpOnly: true,
  });
  response.cookie(Constants.REFRESH_TOKEN_COOKIE_NAME, '', {
    expires: new Date(),
    httpOnly: true,
  });
  response
    .send(SystemUserMessage.signedOutSystemUserResponse(StatusCodes.OK))
    .end();
}

export async function onRefreshToken(request: Request, response: Response) {
  const { refreshToken } = request.cookies;

  if (refreshToken && tokenList[refreshToken]) {
    const { _id, email } = decode(refreshToken) as any;
    const newToken = generateJWTToken(_id, email);

    tokenList[refreshToken] = newToken;

    const responseMessage: ResponseMessage = SystemUserMessage.systemUserRefreshTokenResponse(
      StatusCodes.OK,
    );

    response.cookie(Constants.JSON_WEB_TOKEN_COOKIE_NAME, newToken, {
      expires: new Date(new Date().getTime() + +jsonWebTokenLifetime),
      httpOnly: true,
    });

    logger.debug('onRefreshToken', 'Refresh token from user was refreshed.');

    response
      .status(responseMessage.meta.statusCode)
      .send(responseMessage)
      .end();
    return;
  }

  const responseMessage: ResponseMessage = ErrorMessage.unauthorizedErrorResponse(
    'No valid refresh token.',
  );
  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

function generateJWTToken(_id: string, email: string) {
  const token: string = sign(
    {
      _id,
      email,
    },
    jsonWebTokenSecret,
    { expiresIn: jsonWebTokenLifetime },
  );

  return token;
}

function generateRefreshToken(_id: string, email: string) {
  const refreshToken: string = sign(
    {
      _id,
      email,
    },
    refreshTokenSecret,
    { expiresIn: refreshTokenLifetime },
  );

  return refreshToken;
}
