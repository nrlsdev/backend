import { ResponseMessage } from '@backend/messagehandler';
import { getReasonPhrase, StatusCodes } from '@backend/server';

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

  public static unprocessableEntityErrorResponse(
    error: string = getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
  ) {
    return ErrorMessage.errorResponse(StatusCodes.UNPROCESSABLE_ENTITY, error);
  }

  public static forbiddenErrorResponse(
    error: string = getReasonPhrase(StatusCodes.FORBIDDEN),
  ) {
    return ErrorMessage.errorResponse(StatusCodes.FORBIDDEN, error);
  }

  public static unauthorizedErrorResponse(
    error: string = getReasonPhrase(StatusCodes.UNAUTHORIZED),
  ) {
    return ErrorMessage.errorResponse(StatusCodes.UNAUTHORIZED, error);
  }

  public static internalServerErrorResponse(
    error: string = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
  ) {
    return ErrorMessage.errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }

  public static badRequestErrorResponse(
    error: string = getReasonPhrase(StatusCodes.BAD_REQUEST),
  ) {
    return ErrorMessage.errorResponse(StatusCodes.BAD_REQUEST, error);
  }
}
