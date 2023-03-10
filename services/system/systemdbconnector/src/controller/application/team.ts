import { StatusCodes } from '@backend/server';
import { ApplicationTeamMessage } from '@backend/systemmessagefactory';
import { Database } from '../../database/database';

export async function inviteUserToTeam(
  email: string,
  role: number,
  applicationId: string,
) {
  const {
    statusCode,
    invitationCode,
    error,
  } = await Database.applicationEntity.inviteUserToTeam(
    email,
    role,
    applicationId,
  );

  if (error || statusCode !== StatusCodes.OK) {
    return ApplicationTeamMessage.inviteUserToTeamResponse(
      statusCode,
      undefined,
      error ?? undefined,
    );
  }

  return ApplicationTeamMessage.inviteUserToTeamResponse(
    statusCode,
    invitationCode,
  );
}

export async function acceptInvitation(invitationCode: string, userId: string) {
  const {
    statusCode,
    error,
  } = await Database.applicationEntity.acceptInvitation(invitationCode, userId);

  return ApplicationTeamMessage.acceptInvitationResponse(statusCode, error);
}

export async function deleteInvitation(applicationId: string, userId: string) {
  const {
    statusCode,
    error,
  } = await Database.applicationEntity.deleteInvitation(applicationId, userId);

  return ApplicationTeamMessage.deleteInvitationResponse(statusCode, error);
}

export async function updateAuthorizedUser(
  applicationId: string,
  role: number,
  userId: string,
) {
  const {
    statusCode,
    error,
  } = await Database.applicationEntity.updateAuthorizedUser(
    applicationId,
    role,
    userId,
  );

  return ApplicationTeamMessage.updateAuthorizedUserResponse(statusCode, error);
}
