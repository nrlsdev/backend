import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class SystemUserMessage {
  public static readonly TYPE_SYSTEM_USER_CREATE = 'system_user_create';

  // Create system user
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
    statusMessage: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
        statusMessage,
      },
      body: {},
    };
  }
}
