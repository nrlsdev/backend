import { ResponseMessage } from '@backend/messagehandler';
import { StatusCodes } from '@backend/server';

export class ErrorMessage {
  public static errorResponse(
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

  public static unprocessableEntityErrorResponse(error?: string) {
    return ErrorMessage.errorResponse(StatusCodes.UNPROCESSABLE_ENTITY, error);
  }

  public static forbiddenErrorResponse(error?: string) {
    return ErrorMessage.errorResponse(StatusCodes.FORBIDDEN, error);
  }

  public static unauthorizedErrorResponse(error?: string) {
    return ErrorMessage.errorResponse(StatusCodes.UNAUTHORIZED, error);
  }
}
