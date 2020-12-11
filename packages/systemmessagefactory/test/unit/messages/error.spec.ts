import { ErrorMessage } from '../../../src/messages/error';

const testErrorMessage: string = 'Test error message.';

describe('ErrorMessage', () => {
  describe('.errorResponse()', () => {
    it('should return a error response message', () => {
      const statusCode: number = 404;
      const responseMessage = ErrorMessage.errorResponse(
        statusCode,
        testErrorMessage,
      );

      expect(responseMessage).toMatchObject({
        meta: {
          statusCode,
        },
        body: {
          error: testErrorMessage,
        },
      });
    });
  });

  describe('.unprocessableEntityErrorResponse()', () => {
    it('should return a unprocessable Entity error response message', () => {
      const responseMessage = ErrorMessage.unprocessableEntityErrorResponse(
        testErrorMessage,
      );

      expect(responseMessage).toMatchObject({
        meta: {
          statusCode: 422,
        },
        body: {
          error: testErrorMessage,
        },
      });
    });
  });

  describe('.forbiddenErrorResponse()', () => {
    it('should return a forbidden error response message', () => {
      const responseMessage = ErrorMessage.forbiddenErrorResponse(
        testErrorMessage,
      );

      expect(responseMessage).toMatchObject({
        meta: {
          statusCode: 403,
        },
        body: {
          error: testErrorMessage,
        },
      });
    });
  });

  describe('.unauthorizedErrorResponse()', () => {
    it('should return an unauthorized error response message', () => {
      const responseMessage = ErrorMessage.unauthorizedErrorResponse(
        testErrorMessage,
      );

      expect(responseMessage).toMatchObject({
        meta: {
          statusCode: 401,
        },
        body: {
          error: testErrorMessage,
        },
      });
    });
  });
});
