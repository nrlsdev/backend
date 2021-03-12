import { ApplicationUserMessage } from '@backend/applicationmessagefactory';
import { StatusCodes } from '@backend/server';
import { Database } from '../../database';

export async function getApplicationUserByTwitterId(id: string) {
  const result = await Database.applicationUserEntity.getApplicationUserByTwitterId(
    id,
  );

  return ApplicationUserMessage.getApplicationUserByTwitterResponse(
    StatusCodes.OK,
    result,
  );
}

export async function applicationUserTwitterSignUp(id: string) {
  const result = await Database.applicationUserEntity.applicationUserTwitterSignUp(
    id,
  );

  return ApplicationUserMessage.applicationUserTwitterSignUpResponse(
    result.statusCode,
    result.error,
  );
}
