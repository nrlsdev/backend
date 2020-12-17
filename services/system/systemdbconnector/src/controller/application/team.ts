import { StatusCodes } from '@backend/server';
import {
  ApplicationTeamMessage,
  ErrorMessage,
} from '@backend/systemmessagefactory';
import { Database } from '../../database/database';

export async function addUserToTeam(id: string, email: string) {
  const error = await Database.applicationEntity.addUserToTeam(id, email);

  if (error) {
    return ErrorMessage.unprocessableEntityErrorResponse(error);
  }

  return ApplicationTeamMessage.teamAddedUserResponse(StatusCodes.OK);
}
