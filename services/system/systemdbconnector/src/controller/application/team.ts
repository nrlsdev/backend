import { StatusCodes } from '@backend/server';
import {
  ApplicationTeamMessage,
  ErrorMessage,
} from '@backend/systemmessagefactory';
import { Database } from '../../database/database';

export async function inviteUserToTeam(id: string, email: string) {
  const {
    error,
    invitationCode,
  } = await Database.applicationEntity.inviteUserToTeam(id, email);

  if (error) {
    return ErrorMessage.unprocessableEntityErrorResponse(error);
  }

  return ApplicationTeamMessage.invitedUserToTeamResponse(
    StatusCodes.OK,
    invitationCode!,
  );
}

export async function acceptInvitation(userId: string, invitationCode: string) {
  const invitationAccepted = await Database.applicationEntity.acceptInvitation(
    userId,
    invitationCode,
  );

  if (!invitationAccepted) {
    return ApplicationTeamMessage.invitedUserToTeamResponse(
      StatusCodes.NOT_FOUND,
      'Invalid or unknown invitation code.',
    );
  }

  return ApplicationTeamMessage.invitedUserToTeamResponse(StatusCodes.OK);
}
