import { ErrorMessage, SystemUserMessage } from '@backend/systemmessagefactory';
import { StatusCodes } from '@backend/server';
import { Database } from '../database/database';
import { SystemUser } from '../database/entities/system-user-entity';
import { MongoErrorCode } from '../database/error-codes';

export async function createSystemUser(systemUser: SystemUser) {
  const error = await Database.systemUserEntity.createSystemUser(systemUser);

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

export async function signInSystemUser(email: string, password: string) {
  const result = await Database.systemUserEntity.signInSystemUser(
    email,
    password,
  );

  if (result.error) {
    return ErrorMessage.errorResponse(
      StatusCodes.UNAUTHORIZED,
      result.error.message,
    );
  }

  return SystemUserMessage.signedInSystemUserDatabaseResponse(
    StatusCodes.OK,
    result._id,
    result.email,
  );
}
