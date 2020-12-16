import { StatusCodes } from '@backend/server';
import {
  ApplicationMessage,
  ErrorMessage,
} from '@backend/systemmessagefactory';
import { Database } from '../database/database';
import { Application } from '../database/entities/application-entity';
import { MongoErrorCode } from '../database/error-codes';

export async function createApplication(application: Application) {
  const error = await Database.applicationEntity.createApplication(application);

  if (error) {
    if (error.code === MongoErrorCode.DUPLICATE_KEY) {
      return ApplicationMessage.createdApplicationResponse(
        StatusCodes.CONFLICT,
        'BundleId is already in use.',
      );
    }
    return ErrorMessage.unprocessableEntityErrorResponse();
  }

  return ApplicationMessage.createdApplicationResponse(StatusCodes.OK);
}
