import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class ApplicationTeamMessage {
  public static readonly TYPE_APPLICATION_TEAM_INVITE_USER_TO_TEAM =
    'application_team_invite_user_to_team';

  public static readonly TYPE_APPLICATION_TEAM_ACCEPT_INVITATION =
    'application_team_accept_invitation';

  public static readonly TYPE_APPLICATION_TEAM_DELETE_INVITATION =
    'application_team_delete_invitation';

  // invite user
  public static inviteUserToTeamRequest(
    email: string,
    role: number,
    applicationId: string,
  ): RequestMessage {
    return {
      meta: {
        type: ApplicationTeamMessage.TYPE_APPLICATION_TEAM_INVITE_USER_TO_TEAM,
      },
      body: {
        data: {
          email,
          role,
          applicationId,
        },
      },
    };
  }

  public static inviteUserToTeamResponse(
    statusCode: number,
    invitationCode?: string | null,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          invitationCode,
        },
        error,
      },
    };
  }

  // accept invitation
  public static acceptInvitationRequest(
    invitationCode: string,
    userId: string,
  ): RequestMessage {
    return {
      meta: {
        type: ApplicationTeamMessage.TYPE_APPLICATION_TEAM_ACCEPT_INVITATION,
      },
      body: {
        data: {
          invitationCode,
          userId,
        },
      },
    };
  }

  public static acceptInvitationResponse(
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

  // delete invitation
  public static deleteInvitationRequest(
    applicationId: string,
    userId: string,
  ): RequestMessage {
    return {
      meta: {
        type: ApplicationTeamMessage.TYPE_APPLICATION_TEAM_DELETE_INVITATION,
      },
      body: {
        data: {
          applicationId,
          userId,
        },
      },
    };
  }

  public static deleteInvitationResponse(
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
