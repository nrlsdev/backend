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
  public static postRequest(collection: string, data: any, userId: string): RequestMessage {
    return {
      meta: {
        type: OperationsMessage.TYPE_APPLICATION_OPERATIONS_POST,
      },
      body: {
        data: {
          collection,
          data,
          userId,
        },
      },
    };
  }

  public static postResponse(
    collection: string,
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
          collection,
          result,
          method: OperationsMessage.TYPE_APPLICATION_OPERATIONS_POST,
        },
        error,
      },
    };
  }

  // get
  public static getRequest(collection: string, entities: any, selectAll: boolean = false, userId: string): RequestMessage {
    return {
      meta: {
        type: OperationsMessage.TYPE_APPLICATION_OPERATIONS_GET,
      },
      body: {
        data: {
          collection,
          entities,
          selectAll,
          userId,
        },
      },
    };
  }

  public static getResponse(
    collection: string,
    result: any,
    idsToDelete: string[] = [],
    statusCode: number,
    error?: string,
  ): ResponseMessage {
    return {
      meta: {
        statusCode,
      },
      body: {
        data: {
          collection,
          result,
          idsToDelete,
          method: OperationsMessage.TYPE_APPLICATION_OPERATIONS_GET,
        },
        error,
      },
    };
  }

  // put
  public static putRequest(collection: string, data: any, objectId: string, userId: string): RequestMessage {
    return {
      meta: {
        type: OperationsMessage.TYPE_APPLICATION_OPERATIONS_PUT,
      },
      body: {
        data: {
          collection,
          data,
          objectId,
          userId,
        },
      },
    };
  }

  public static putResponse(
    collection: string,
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
          collection,
          result,
          method: OperationsMessage.TYPE_APPLICATION_OPERATIONS_PUT,
        },
        error,
      },
    };
  }

  // delete
  public static deleteRequest(collection: string, objectId: string, userId: string): RequestMessage {
    return {
      meta: {
        type: OperationsMessage.TYPE_APPLICATION_OPERATIONS_DELETE,
      },
      body: {
        data: {
          collection,
          objectId,
          userId,
        },
      },
    };
  }

  public static deleteResponse(
    collection: string,
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
          collection,
          result,
          method: OperationsMessage.TYPE_APPLICATION_OPERATIONS_DELETE,
        },
        error,
      },
    };
  }
}
