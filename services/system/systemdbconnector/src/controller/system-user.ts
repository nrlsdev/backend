import {
  ErrorMessage,
  StatusCodes,
  SystemUserMessage,
} from '@backend/systemmessagefactory';
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
  const error = await Database.systemUserEntity.signInSystemUser(
    email,
    password,
  );

  if (error) {
    return ErrorMessage.errorResponse(StatusCodes.UNAUTHORIZED, error.message);
  }

  return SystemUserMessage.signedInSystemUserResponse(
    StatusCodes.OK,
    'ToDo: Generate Token',
  ); // ToDo
}
