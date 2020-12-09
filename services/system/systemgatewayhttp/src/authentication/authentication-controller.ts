import {
  MessageQueueType,
  MessageSeverityType,
  ResponseMessage,
} from '@backend/messagehandler';
import { Request, Response, StatusCodes } from '@backend/server';
import { ErrorMessage, SystemUserMessage } from '@backend/systemmessagefactory';
import { sign } from 'jsonwebtoken';
import { messageManager } from '../message-manager';

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
    token,
    refreshToken,
  );

  tokenList[refreshToken] = token;

  response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function onRefreshToken(request: Request, response: Response) {
  const { body } = request;
  const { refreshToken } = body;

  if (refreshToken && tokenList[refreshToken]) {
    const newToken = generateJWTToken('_id', 'email');

    tokenList[refreshToken] = newToken;
    const responseMessage: ResponseMessage = SystemUserMessage.refreshSystemUserTokenResponse(
      StatusCodes.OK,
      newToken,
    );
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
    'TOKEN - SECRET OR KEY',
    { expiresIn: '300000' },
  ); // ToDo: KeyOrSecret

  return token;
}

function generateRefreshToken(_id: string, email: string) {
  const refreshToken: string = sign(
    {
      _id,
      email,
    },
    'REFRESH TOKEN - SECRET OR KEY',
    { expiresIn: '86400000' },
  ); // ToDo: KeyOrSecret

  return refreshToken;
}
