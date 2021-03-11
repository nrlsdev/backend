import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class ApplicationUserMessage {
  public static readonly TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_SIGNUP: string =
    'appliation_user_email_and_password_signup';

  public static applicationUserEmailAndPasswordSignUpRequest(
    email: string,
    password: string,
  ): RequestMessage {
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

  public static applicationUserEmailAndPasswordSignUpResponse(
    statusCode: number,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        error,
      },
    };
  }
}
