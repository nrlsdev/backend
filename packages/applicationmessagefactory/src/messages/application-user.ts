import { RequestMessage, ResponseMessage } from '@backend/messagehandler';
import { ApplicationUser } from '@backend/applicationinterfaces';

export class ApplicationUserMessage {
  public static readonly TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_SIGNUP: string =
    'appliation_user_email_and_password_signup';

  public static readonly TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_SIGNIN: string =
    'appliation_user_email_and_password_signin';

  public static readonly TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_ACTIVATE: string =
    'appliation_user_email_and_password_activate';

  public static readonly TYPE_APPLICATION_GET_APPLICATION_USER_BY_ID: string =
    'appliation_get_application_user_by_id';

  // email and password
  // signup
  public static applicationUserEmailAndPasswordSignUpRequest(
    email: string,
    password: string,
    activationCode: string,
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
          activationCode,
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

  // signin
  public static applicationUserEmailAndPasswordSignInRequest(
    email: string,
    password: string,
  ): RequestMessage {
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

  public static applicationUserEmailAndPasswordSignInResponse(
    statusCode: number,
    id?: string,
    email?: string,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          id,
          email,
        },
        error,
      },
    };
  }

  // actiate
  public static applicationUserEmailAndPasswordActivateRequest(
    activationCode: string,
  ): RequestMessage {
    return {
      meta: {
        type:
          ApplicationUserMessage.TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_ACTIVATE,
      },
      body: {
        data: {
          activationCode,
        },
      },
    };
  }

  public static applicationUserEmailAndPasswordActivateResponse(
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

  // get user
  public static getApplicationUserByIdRequest(id: string): RequestMessage {
    return {
      meta: {
        type:
          ApplicationUserMessage.TYPE_APPLICATION_GET_APPLICATION_USER_BY_ID,
      },
      body: {
        data: {
          id,
        },
      },
    };
  }

  public static getApplicationUserByIdResponse(
    applicationUser: ApplicationUser,
    statusCode: number,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: applicationUser,
        error,
      },
    };
  }
}
