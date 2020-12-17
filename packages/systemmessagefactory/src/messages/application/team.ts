import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class ApplicationTeamMessage {
  public static readonly TYPE_APPLICATION_TEAM_INVITE_USER =
    'application_team_invite_user';

  public static readonly TYPE_APPLICATION_TEAM_ACCEPT_INVITATION =
    'application_team_accept_invitation';

  // invite
  public static inviteUserToTeamRequest(
    id: string,
    email: string,
  ): RequestMessage {
    return {
      meta: {
        type: ApplicationTeamMessage.TYPE_APPLICATION_TEAM_INVITE_USER,
      },
      body: {
        data: {
          id,
          email,
        },
      },
    };
  }

  public static invitedUserToTeamResponse(
    statusCode: number,
    invitationCode?: string,
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
    userId: string,
    invitationCode: string,
  ): RequestMessage {
    return {
      meta: {
        type: ApplicationTeamMessage.TYPE_APPLICATION_TEAM_ACCEPT_INVITATION,
      },
      body: {
        data: {
          userId,
          invitationCode,
        },
      },
    };
  }

  public static acceptedInvitationResponse(
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
