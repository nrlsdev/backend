import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class ApplicationUserMessage {
  public static TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_SIGNUP: string =
    'application_user_email_and_password_signup';

  public static TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_SIGNIN: string =
    'application_user_email_and_password_signin';

  // signUp
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

  public static signUpResponse(
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

  // signIn
  public static signInRequest(email: string, password: string): RequestMessage {
    return {
      meta: {
        type:
          ApplicationUserMessage.TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_SIGNIN,
      },
      body: {
        data: {
          email,
          password,
        },
      },
    };
  }

  public static signInResponse(
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
