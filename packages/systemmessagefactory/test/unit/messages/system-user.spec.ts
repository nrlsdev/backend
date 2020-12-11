import { SystemUserMessage } from '../../src/messages/system-user';

const email: string = 'test@revanced.com';
const password: string = 'password1234';
const testErrorMessage: string = 'Test error message.';

describe('SystemUserMessage', () => {
  describe('.createSystemUserRequest()', () => {
    it('should return a create systemuser request message', () => {
      const firstname: string = 'Test';
      const lastname: string = 'Revanced';

      const responseMessage = SystemUserMessage.createSystemUserRequest(
        email,
        firstname,
        lastname,
        password,
      );

      expect(responseMessage).toMatchObject({
        meta: {
          type: SystemUserMessage.TYPE_SYSTEM_USER_CREATE,
        },
        body: {
          data: {
            email,
            password,
            firstname,
            lastname,
          },
        },
      });
    });
  });

  describe('.createdSystemUserResponse()', () => {
    it('should return a created systemuser response message without an error object', () => {
      const statusCode: number = 200;
      const responseMessage = SystemUserMessage.createdSystemUserResponse(
        statusCode,
      );

      expect(responseMessage).toMatchObject({
        meta: {
          statusCode,
        },
        body: {},
      });
    });

    it('should return a created systemuser response message with an error object', () => {
      const statusCode: number = 400;
      const responseMessage = SystemUserMessage.createdSystemUserResponse(
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

  describe('.signInSystemUserRequest()', () => {
    it('should return a sign in systemuser request message', () => {
      const responseMessage = SystemUserMessage.signInSystemUserRequest(
        email,
        password,
      );

      expect(responseMessage).toMatchObject({
        meta: {
          type: SystemUserMessage.TYPE_SYSTEM_USER_SIGN_IN,
        },
        body: {
          data: {
            email,
            password,
          },
        },
      });
    });
  });

  describe('.signedInSystemUserDatabaseResponse()', () => {
    it('should return a signed in systemuser database response message without an error object', () => {
      const _id: string = '2931023-sadkasd983d-2190ej01d12-d12d21d';
      const statusCode: number = 200;
      const responseMessage = SystemUserMessage.signedInSystemUserDatabaseResponse(
        statusCode,
        _id,
        email,
      );

      expect(responseMessage).toMatchObject({
        meta: {
          statusCode,
        },
        body: {
          data: {
            _id,
            email,
          },
        },
      });
    });

    it('should return a signed in systemuser database response message with an error object', () => {
      const _id: string = '2931023-sadkasd983d-2190ej01d12-d12d21d';
      const statusCode: number = 400;
      const responseMessage = SystemUserMessage.signedInSystemUserDatabaseResponse(
        statusCode,
        _id,
        email,
        testErrorMessage,
      );

      expect(responseMessage).toMatchObject({
        meta: {
          statusCode,
        },
        body: {
          data: {
            _id,
            email,
          },
          error: testErrorMessage,
        },
      });
    });
  });

  describe('.signedInSystemUserResponse()', () => {
    it('should return a signed in systemuser response message without an error object', () => {
      const statusCode: number = 200;
      const responseMessage = SystemUserMessage.signedInSystemUserResponse(
        statusCode,
      );

      expect(responseMessage).toMatchObject({
        meta: {
          statusCode,
        },
        body: {},
      });
    });

    it('should return a signed in systemuser response message with an error object', () => {
      const statusCode: number = 400;
      const responseMessage = SystemUserMessage.signedInSystemUserResponse(
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

  describe('.systemUserRefreshTokenResponse()', () => {
    it('should return a systemuser refresh token response message without an error object', () => {
      const statusCode: number = 200;
      const responseMessage = SystemUserMessage.systemUserRefreshTokenResponse(
        statusCode,
      );

      expect(responseMessage).toMatchObject({
        meta: {
          statusCode,
        },
        body: {},
      });
    });

    it('should return a systemuser refresh token response message with an error object', () => {
      const statusCode: number = 400;
      const responseMessage = SystemUserMessage.systemUserRefreshTokenResponse(
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
});
