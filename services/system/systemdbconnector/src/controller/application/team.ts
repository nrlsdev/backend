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
