import { StatusCodes } from '@backend/server';
import {
  ApplicationMessage,
  ErrorMessage,
} from '@backend/systemmessagefactory';
import { Database } from '../../database/database';
import { MongoErrorCode } from '../../database/error-codes';

export async function createApplication(
  bundleId: string,
  name: string,
  ownerId: string,
) {
  const error = await Database.applicationEntity.createApplication(
    bundleId,
    name,
    ownerId,
  );

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

export async function getAllApplicationsUserHasAuthorizationFor(
  userId: string,
) {
  const {
    applications,
    error,
  } = await Database.applicationEntity.getAllApplicationsUserHasAuthorizationFor(
    userId,
  );

  if (error || !applications) {
    return ApplicationMessage.getAllApplicationsUserHasAuthorizationForResponse(
      StatusCodes.NOT_FOUND,
      [],
      'No applications found.',
    );
  }

  return ApplicationMessage.getAllApplicationsUserHasAuthorizationForResponse(
    StatusCodes.OK,
    applications,
  );
}

export async function getApplicationByIdUserHasAuthorizationFor(
  applicationId: string,
  userId: string,
) {
  const {
    error,
    application,
  } = await Database.applicationEntity.getApplicationByIdUserHasAuthorizationFor(
    applicationId,
    userId,
  );

  if (error || !application) {
    return ApplicationMessage.getApplicationByIdResponse(
      StatusCodes.NOT_FOUND,
      undefined,
      'No applications found',
    );
  }

  return ApplicationMessage.getApplicationByIdResponse(
    StatusCodes.OK,
    application,
  );
}

export async function getUserApplicationRole(
  applicationId: string,
  userId: string,
) {
  const {
    error,
    role,
    statusCode,
  } = await Database.applicationEntity.getUserApplicationRole(
    applicationId,
    userId,
  );

  if (error || statusCode !== StatusCodes.OK) {
    return ErrorMessage.errorResponse(statusCode, error);
  }

  return ApplicationMessage.getUserApplicationRoleResponse(statusCode, role!);
}
