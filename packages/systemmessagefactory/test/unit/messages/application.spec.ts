import { ApplicationMessage } from '../../../src/messages/application';

const testErrorMessage: string = 'Test error message.';

describe('ApplicationMessage', () => {
  describe('.createApplicationRequest()', () => {
    it('should return a create application request message', () => {
      const bundleId: string = 'bundle-id';
      const name: string = 'name';
      const authorizedUsers = { userId: '123-456-789-0' };

      const requestMessage = ApplicationMessage.createApplicationRequest(
        bundleId,
        name,
        authorizedUsers,
      );

      expect(requestMessage).toMatchObject({
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
      });
    });
  });

  describe('.createdApplicationResponse()', () => {
    it('should return a created application response message without an error object', () => {
      const statusCode: number = 200;
      const responseMessage = ApplicationMessage.createdApplicationResponse(
        statusCode,
      );

      expect(responseMessage).toMatchObject({
        meta: {
          statusCode,
        },
        body: {},
      });
    });

    it('should return a created application response message with an error object', () => {
      const statusCode: number = 400;
      const responseMessage = ApplicationMessage.createdApplicationResponse(
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

  describe('.getAllApplicationsUserHasAuthorizationForRequest()', () => {
    it('should return a get all application user has authorization for request message', () => {
      const userId: string = '123-456-789-0';
      const requestMessage = ApplicationMessage.getAllApplicationsUserHasAuthorizationForRequest(
        userId,
      );

      expect(requestMessage).toMatchObject({
        meta: {
          type:
            ApplicationMessage.TYPE_APPLICATION_GET_ALL_APPLICATIONS_USER_HAS_AUTHORIZATION_FOR,
        },
        body: {
          data: {
            userId,
          },
        },
      });
    });
  });

  describe('.getAllApplicationsUserHasAuthorizationForResponse()', () => {
    it('should return a get all applications user has authorization for response message without an error object', () => {
      const statusCode: number = 200;
      const applications = [];

      const requestMessage = ApplicationMessage.getAllApplicationsUserHasAuthorizationForResponse(
        statusCode,
        applications,
      );

      expect(requestMessage).toMatchObject({
        meta: {
          statusCode,
        },
        body: {
          data: {
            applications,
          },
        },
      });
    });

    it('should return a get all applications user has authorization for response message with an error object', () => {
      const statusCode: number = 400;
      const applications = [];

      const requestMessage = ApplicationMessage.getAllApplicationsUserHasAuthorizationForResponse(
        statusCode,
        applications,
        testErrorMessage,
      );

      expect(requestMessage).toMatchObject({
        meta: {
          statusCode,
        },
        body: {
          data: {
            applications,
          },
          error: testErrorMessage,
        },
      });
    });
  });

  describe('.getApplicationByIdResponse()', () => {
    it('should return a get application by id response message without an error and without an applications array object', () => {
      const statusCode: number = 200;

      const requestMessage = ApplicationMessage.getApplicationByIdResponse(
        statusCode,
      );

      expect(requestMessage).toMatchObject({
        meta: {
          statusCode,
        },
        body: {},
      });
    });

    it('should return a get application by id response message with an error and without an application object', () => {
      const statusCode: number = 200;
      const requestMessage = ApplicationMessage.getApplicationByIdResponse(
        statusCode,
        undefined,
        testErrorMessage,
      );

      expect(requestMessage).toMatchObject({
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
