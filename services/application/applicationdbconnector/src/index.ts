import { Logger } from '@backend/logger';
import {
  MessageManager,
  MessageQueueType,
  MessageSeverityType,
  RequestMessage,
} from '@backend/messagehandler';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import {
  ApplicationUserMessage,
  ErrorMessage,
  OperationsMessage,
} from '@backend/applicationmessagefactory';
import { Database } from './database/database';
import {
  signUpEmailAndPassword,
  signInEmailAndPassword,
  activateEmailAndPassword,
  getApplicationUserById,
} from './database/controller/appliction-user/application-user-email-and-password-controller';
import {
  getApplicationUserByFacebookId,
  applicationUserFacebookSignUp,
} from './database/controller/appliction-user/application-user-facebook-controller';
import {
  getApplicationUserByTwitterId,
  applicationUserTwitterSignUp,
} from './database/controller/appliction-user/application-user-twitter-controller';
import {
  dbPost,
  dbGet,
  dbPut,
  dbDelete,
} from './database/controller/operations/operations';

const logger: Logger = new Logger('applicationdbconnector::index');
const { mhHost, mhPort } = ApplicationConfiguration.applicationmessagehandler;
const messageManager: MessageManager = MessageManager.create({
  hostname: mhHost,
  port: mhPort,
});

startup();

async function startup() {
  await connectToDatabase();

  messageManager.createRPCServer(
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_USER,
    onApplicationUserMessage,
  );

  messageManager.createRPCServer(
    MessageQueueType.APPLICATION_DBCONNECTOR,
    MessageSeverityType.APPLICATION_OPERATIONS,
    onApplicationOperationsMessage,
  );
}

async function connectToDatabase() {
  const {
    dbHost,
    dbPort,
    dbName,
    dbUsername,
    dbPassword,
  } = ApplicationConfiguration.applicationdbconnector;

  try {
    await Database.connect(dbHost, dbPort, dbName, dbUsername, dbPassword);
    logger.info('connectToDatabase', 'Connected to the application database');
  } catch (exception) {
    logger.error('connectToDatabase', exception.message);
  }
}

async function onApplicationUserMessage(requestMessage: RequestMessage) {
  const { type } = requestMessage.meta;
  const { data }: any = requestMessage.body;

  if (!type) {
    return ErrorMessage.unprocessableEntityErrorResponse();
  }

  switch (type) {
    // email and password
    case ApplicationUserMessage.TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_SIGNUP: {
      return signUpEmailAndPassword(
        data.email,
        data.password,
        data.activationCode,
      );
    }
    case ApplicationUserMessage.TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_SIGNIN: {
      return signInEmailAndPassword(data.email, data.password);
    }
    case ApplicationUserMessage.TYPE_APPLICATION_USER_EMAIL_AND_PASSWORD_ACTIVATE: {
      return activateEmailAndPassword(data.activationCode);
    }
    case ApplicationUserMessage.TYPE_APPLICATION_GET_APPLICATION_USER_BY_ID: {
      return getApplicationUserById(data.id);
    }
    // facebook
    case ApplicationUserMessage.TYPE_APPLICATION_GET_APPLICATION_USER_BY_FACEBOOK_ID: {
      return getApplicationUserByFacebookId(data.id);
    }
    case ApplicationUserMessage.TYPE_APPLICATION_USER_FACEBOOK_SIGNUP: {
      return applicationUserFacebookSignUp(data.id);
    }
    // twitter
    case ApplicationUserMessage.TYPE_APPLICATION_GET_APPLICATION_USER_BY_TWITTER_ID: {
      return getApplicationUserByTwitterId(data.id);
    }
    case ApplicationUserMessage.TYPE_APPLICATION_USER_TWITTER_SIGNUP: {
      return applicationUserTwitterSignUp(data.id);
    }
    default: {
      return ErrorMessage.unprocessableEntityErrorResponse(
        `Message of type '${type}' not implemented!`,
      );
    }
  }
}

async function onApplicationOperationsMessage(requestMessage: RequestMessage) {
  const { type } = requestMessage.meta;
  const { data }: any = requestMessage.body;

  if (!type) {
    return ErrorMessage.unprocessableEntityErrorResponse();
  }

  switch (type) {
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_POST: {
      return dbPost(data.collection, data.data, data.userPermissions, data.userId);
    }
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_GET: {
      return dbGet(data.collection, data.query, data.userId);
    }
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_PUT: {
      return dbPut(data.collection, data.data, data.objectId, data.userId);
    }
    case OperationsMessage.TYPE_APPLICATION_OPERATIONS_DELETE: {
      return dbDelete(data.collection, data.objectId, data.userId);
    }
    default: {
      return ErrorMessage.unprocessableEntityErrorResponse(
        `Message of type '${type}' not implemented!`,
      );
    }
  }
}
