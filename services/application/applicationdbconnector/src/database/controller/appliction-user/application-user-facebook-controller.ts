import { ApplicationUserMessage } from '@backend/applicationmessagefactory';
import { StatusCodes } from '@backend/server';
import { Database } from '../../database';

export async function getApplicationUserByFacebookId(id: string) {
  const result = await Database.applicationUserEntity.getApplicationUserByFacebookId(
    id,
  );

  return ApplicationUserMessage.getApplicationUserByFacebookResponse(
    StatusCodes.OK,
    result,
  );
}

export async function applicationUserFacebookSignUp(id: string) {
  const result = await Database.applicationUserEntity.applicationUserFacebookSignUp(
    id,
  );

  return ApplicationUserMessage.applicationUserFacebookSignUpResponse(
    result.statusCode,
    result.error,
  );
}
