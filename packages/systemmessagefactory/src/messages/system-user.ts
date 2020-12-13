import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class SystemUserMessage {
  public static readonly TYPE_SYSTEM_USER_CREATE = 'system_user_create';

  public static readonly TYPE_SYSTEM_USER_SIGN_IN = 'system_user_sign_in';

  public static readonly TYPE_SYSTEM_USER_DATA = 'system_user_data';

  // Create system user request
  public static createSystemUserRequest(
    email: string,
    firstname: string,
    lastname: string,
    password: string,
  ): RequestMessage {
    return {
      meta: {
        type: SystemUserMessage.TYPE_SYSTEM_USER_CREATE,
      },
      body: {
        data: {
          email,
          password,
          firstname,
          lastname,
        },
      },
    };
  }

  public static createdSystemUserResponse(
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

  // Signin with system user request
  public static signInSystemUserRequest(
    email: string,
    password: string,
  ): RequestMessage {
    return {
      meta: {
        type: SystemUserMessage.TYPE_SYSTEM_USER_SIGN_IN,
      },
      body: {
        data: {
          email,
          password,
        },
      },
    };
  }

  public static signedInSystemUserDatabaseResponse(
    statusCode: number,
    _id: string,
    email: string,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          _id,
          email,
        },
        error,
      },
    };
  }

  public static signedInSystemUserResponse(
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

  // SignOut
  public static signedOutSystemUserResponse(
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

  // Refresh token
  public static systemUserRefreshTokenResponse(
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

  // Get systemuser data
  public static getSystemUserDataRequest(systemUserId: string): RequestMessage {
    return {
      meta: {
        type: SystemUserMessage.TYPE_SYSTEM_USER_DATA,
      },
      body: {
        data: {
          systemUserId,
        },
      },
    };
  }

  public static getSystemUserDataResponse(
    statusCode: number,
    email: string,
    firstname: string,
    lastname: string,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          email,
          firstname,
          lastname,
        },
        error,
      },
    };
  }
}
