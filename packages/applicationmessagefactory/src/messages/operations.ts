import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class OperationsMessage {
  public static readonly TYPE_APPLICATION_OPERATIONS_POST: string =
    'application_operations_post';

  public static readonly TYPE_APPLICATION_OPERATIONS_GET: string =
    'application_operations_get';

  public static readonly TYPE_APPLICATION_OPERATIONS_PUT: string =
    'application_operations_put';

  public static readonly TYPE_APPLICATION_OPERATIONS_DELETE: string =
    'application_operations_delete';

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

  // put
  public static putRequest(
    collection: string,
    queryObject: any,
    updateObject: any,
  ): RequestMessage {
    return {
      meta: {
        type: OperationsMessage.TYPE_APPLICATION_OPERATIONS_PUT,
      },
      body: {
        data: {
          collection,
          queryObject,
          updateObject,
        },
      },
    };
  }

  public static putResponse(
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

  // delete
  public static deleteRequest(
    collection: string,
    queryObject: any,
  ): RequestMessage {
    return {
      meta: {
        type: OperationsMessage.TYPE_APPLICATION_OPERATIONS_DELETE,
      },
      body: {
        data: {
          collection,
          queryObject,
        },
      },
    };
  }

  public static deleteResponse(
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
