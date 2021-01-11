import { RequestMessage } from '@backend/messagehandler';

export class ApplicationUserMessage {
  public static TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_SIGNUP: string =
    'application_user_email_and_password_signup';

  public static signUpRequest(email: string, password: string): RequestMessage {
    return {
      meta: {
        type:
          ApplicationUserMessage.TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_SIGNUP,
      },
      body: {
        data: {
          email,
          password,
        },
      },
    };
  }
}
