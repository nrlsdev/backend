import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class ApplicationTeamMessage {
  public static readonly TYPE_APPLICATION_TEAM_ADD_USER =
    'application_team_add_user';

  public static teamAddUserRequest(id: string, email: string): RequestMessage {
    return {
      meta: {
        type: ApplicationTeamMessage.TYPE_APPLICATION_TEAM_ADD_USER,
      },
      body: {
        data: {
          id,
          email,
        },
      },
    };
  }

  public static teamAddedUserResponse(
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
