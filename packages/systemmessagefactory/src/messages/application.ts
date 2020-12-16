import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class ApplicationMessage {
  public static readonly TYPE_APPLICATION_CREATE = 'application_create';

  public static readonly TYPE_APPLICATION_GET_ALL_APPLICATIONS_USER_HAS_AUTHORIZATION_FOR =
    'get_all_applications_user_has_authorization_for';

  // create application
  public static createApplicationRequest(
    bundleId: string,
    name: string,
    authorizedUsers: [{ userId: string }], // ToDo: use ApplicationSystemUserRole[]
  ): RequestMessage {
    return {
      meta: {
        type: ApplicationMessage.TYPE_APPLICATION_CREATE,
      },
      body: {
        data: {
          bundleId,
          name,
          authorizedUsers,
        },
      },
    };
  }

  public static createdApplicationResponse(
    statusCode: number,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        error,
      },
    };
  }

  // get all applications user has authorization for
  public static getAllApplicationsUserHasAuthorizationForRequest(
    userId: string,
  ): RequestMessage {
    return {
      meta: {
        type:
          ApplicationMessage.TYPE_APPLICATION_GET_ALL_APPLICATIONS_USER_HAS_AUTHORIZATION_FOR,
      },
      body: {
        data: {
          userId,
        },
      },
    };
  }

  public static getAllApplicationsUserHasAuthorizationForResponse(
    statusCode: number,
    applications: any[],
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          applications,
        },
        error,
      },
    };
  }
}
