import { ApplicationUserMessage } from '@backend/applicationmessagefactory';
import { Database } from '../../database';

export async function signUpEmailAndPassword(
  email: string,
  password: string,
  activationCode: string,
) {
  const result = await Database.applicationUserEntity.signUpEmailAndPassword(
    email,
    password,
    activationCode,
  );

  return ApplicationUserMessage.applicationUserEmailAndPasswordSignUpResponse(
    result.statusCode,
    result.error,
  );
}

export async function activateEmailAndPassword(activationCode: string) {
  const result = await Database.applicationUserEntity.activateEmailAndPassword(
    activationCode,
  );

  return ApplicationUserMessage.applicationUserEmailAndPasswordActivateResponse(
    result.statusCode,
    result.error,
  );
}
