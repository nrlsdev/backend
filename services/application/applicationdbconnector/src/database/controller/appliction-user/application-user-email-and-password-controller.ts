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

export async function signInEmailAndPassword(email: string, password: string) {
  const result = await Database.applicationUserEntity.signInEmailAndPassword(
    email,
    password,
  );

  return ApplicationUserMessage.applicationUserEmailAndPasswordSignInResponse(
    result.statusCode,
    result.user?._id,
    result.user?.email,
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

export async function getApplicationUserById(id: string) {
  const result = await Database.applicationUserEntity.getApplicationUserById(
    id,
  );

  return ApplicationUserMessage.getApplicationUserByIdResponse(
    result.user,
    result.statusCode,
    result.error,
  );
}
