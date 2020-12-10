import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class SystemUserMessage {
  public static readonly TYPE_SYSTEM_USER_CREATE = 'system_user_create';

  public static readonly TYPE_SYSTEM_USER_SIGN_IN = 'system_user_sign_IN';

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
}
