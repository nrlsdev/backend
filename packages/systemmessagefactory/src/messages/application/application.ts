import { RequestMessage, ResponseMessage } from '@backend/messagehandler';
import { Application } from '@backend/systeminterfaces';

export class ApplicationMessage {
  public static readonly TYPE_APPLICATION_CREATE = 'application_create';

  public static readonly TYPE_APPLICATION_GET_ALL_APPLICATIONS_USER_HAS_AUTHORIZATION_FOR =
    'get_all_applications_user_has_authorization_for';

  public static readonly TYPE_APPLICATION_GET_APPLICATION_BY_APPLICATION_ID_USER_HAS_AUTHORIZATION_FOR =
    'get_application_by_application_id_user_has_authorization_for';

  public static readonly TYPE_APPLICATION_GET_USER_ROLE_FOR_APPLICATION =
    'get_user_role_for_application';

  // create application
  public static createApplicationRequest(
    bundleId: string,
    name: string,
    ownerId: string,
  ): RequestMessage {
    return {
      meta: {
        type: ApplicationMessage.TYPE_APPLICATION_CREATE,
      },
      body: {
        data: {
          bundleId,
          name,
          ownerId,
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
    applications: Application[],
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

  // get application by id
  public static getApplicationByIdResponse(
    statusCode: number,
    application?: Application,
    error?: string,
  ) {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          application,
        },
        error,
      },
    };
  }

  public static getApplicationByIdRequest(
    applicationId: string,
    userId: string,
  ): RequestMessage {
    return {
      meta: {
        type:
          ApplicationMessage.TYPE_APPLICATION_GET_APPLICATION_BY_APPLICATION_ID_USER_HAS_AUTHORIZATION_FOR,
      },
      body: {
        data: {
          applicationId,
          userId,
        },
      },
    };
  }

  // user application role
  public static getUserApplicationRoleRequest(
    applicationId: string,
    userId: string,
  ): RequestMessage {
    return {
      meta: {
        type: ApplicationMessage.TYPE_APPLICATION_GET_USER_ROLE_FOR_APPLICATION,
      },
      body: {
        data: {
          applicationId,
          userId,
        },
      },
    };
  }

  public static getUserApplicationRoleResponse(
    statusCode: number,
    role: number,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          role,
        },
        error,
      },
    };
  }
}
