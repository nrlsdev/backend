import {
  ErrorMessage,
  ApplicationUserMessage,
} from '@backend/applicationmessagefactory';
import { Database } from '../../../database/database';

export async function emailAndPasswordSignUp(email: string, password: string) {
  const result = await Database.applicationUserEntity.emailAndPasswordSignUp(
    email,
    password,
  );
  const { error, statusCode } = result;

  if (error) {
    return ErrorMessage.errorResponse(statusCode, error);
  }

  return ApplicationUserMessage.signUpResponse(statusCode, error);
}

export async function emailAndPasswordSignIn(email: string, password: string) {
  const result = await Database.applicationUserEntity.emailAndPasswordSignIn(
    email,
    password,
  );
  const { error, statusCode } = result;

  if (error) {
    return ErrorMessage.errorResponse(statusCode, error.message);
  }

  return ApplicationUserMessage.signInResponse(statusCode, error);
}
