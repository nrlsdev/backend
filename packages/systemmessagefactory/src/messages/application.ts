import { RequestMessage } from '@backend/messagehandler';

export class ApplicationMessage {
  public static readonly TYPE_APPLICATION_CREATE = 'application_create';

  // create application
  public static createApplicationRequest(
    bundleId: string,
    name: string,
    authorizedUsers: string[],
  ): RequestMessage {
    return {
      meta: {
        type: ApplicationMessage.TYPE_APPLICATION_CREATE,
      },
      body: {
        data: {
          bundleId,
          name,
          authorizedUsers,
        },
      },
    };
  }

  public static createdApplicationResponse(statusCode: number, error?: string) {
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
