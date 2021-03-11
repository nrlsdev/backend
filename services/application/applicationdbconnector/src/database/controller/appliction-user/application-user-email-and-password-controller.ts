import { ApplicationUserMessage } from '@backend/applicationmessagefactory';
import { Database } from '../../database';

export async function signUpEmailAndPassword(email: string, password: string) {
  const result = await Database.applicationUserEntity.signUpEmailAndPassword(
    email,
    password,
  );

  return ApplicationUserMessage.applicationUserEmailAndPasswordSignUpResponse(
    result.statusCode,
    result.error,
  );
}
