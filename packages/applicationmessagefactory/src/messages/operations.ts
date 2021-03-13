import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class OperationsMessage {
  public static readonly TYPE_APPLICATION_OPERATIONS_POST: string =
    'appliation_operations_post';

  public static readonly TYPE_APPLICATION_OPERATIONS_GET: string =
    'appliation_operations_get';
  // post
  public static postRequest(collection: string, data: any): RequestMessage {
    return {
      meta: {
        type: OperationsMessage.TYPE_APPLICATION_OPERATIONS_POST,
      },
      body: {
        data: {
          collection,
          data,
        },
      },
    };
  }

  public static postResponse(
    id: string | undefined,
    statusCode: number,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          id,
        },
        error,
      },
    };
  }

  // get
  public static getRequest(
    collection: string,
    queryObject: any,
    fields: string[],
  ): RequestMessage {
    return {
      meta: {
        type: OperationsMessage.TYPE_APPLICATION_OPERATIONS_GET,
      },
      body: {
        data: {
          collection,
          queryObject,
          fields,
        },
      },
    };
  }

  public static getResponse(
    result: any,
    statusCode: number,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          result,
        },
        error,
      },
    };
  }
}
