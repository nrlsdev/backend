export class ErrorMessage {
  public static errorResponse(
    statusCode: number,
    statusMessage: string,
    error?: string,
  ) {
    return {
      meta: {
        statusCode,
        statusMessage,
      },
      body: {
        error,
      },
    };
  }

  public static unprocessableEntityErrorResponse(error?: string) {
    return ErrorMessage.errorResponse(422, 'Unprocessable Entity', error);
  }
}
