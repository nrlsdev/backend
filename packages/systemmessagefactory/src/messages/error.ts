import { ResponseMessage } from '@backend/messagehandler';
import { StatusCodes } from '../status-codes';

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
}
