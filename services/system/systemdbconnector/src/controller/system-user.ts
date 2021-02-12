import { ErrorMessage, SystemUserMessage } from '@backend/systemmessagefactory';
import { StatusCodes } from '@backend/server';
import { SystemUser } from '@backend/systeminterfaces';
import { Database } from '../database/database';
import { MongoErrorCode } from '../database/error-codes';

export async function signUp(systemUser: SystemUser) {
  const error = await Database.systemUserEntity.signUp(systemUser);

  if (error) {
    if (error.code === MongoErrorCode.DUPLICATE_KEY) {
      return SystemUserMessage.createdSystemUserResponse(
        StatusCodes.CONFLICT,
        'E-Mail is already in use.',
      );
    }
    return ErrorMessage.unprocessableEntityErrorResponse();
  }

  return SystemUserMessage.createdSystemUserResponse(StatusCodes.OK);
}

export async function signIn(email: string, password: string) {
  const result = await Database.systemUserEntity.signIn(email, password);

  if (result.error) {
    return ErrorMessage.unauthorizedErrorResponse(result.error.message);
  }

  return SystemUserMessage.signedInSystemUserDatabaseResponse(
    StatusCodes.OK,
    result._id,
    result.email,
  );
}

export async function getSystemuserData(systemUserId: string) {
  const result = await Database.systemUserEntity.getSystemuserData(
    systemUserId,
  );

  const { error, systemUser } = result;

  if (error || !systemUser) {
    return ErrorMessage.unauthorizedErrorResponse(error);
  }

  return SystemUserMessage.getSystemUserDataResponse(
    StatusCodes.OK,
    systemUser._id,
    systemUser.email,
    systemUser.firstname,
    systemUser.lastname,
  );
}
