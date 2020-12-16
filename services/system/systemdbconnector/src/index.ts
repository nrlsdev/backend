import { Logger } from '@backend/logger';
import {
  MessageManager,
  MessageQueueType,
  MessageSeverityType,
  RequestMessage,
} from '@backend/messagehandler';
import {
  SystemUserMessage,
  ErrorMessage,
  ApplicationMessage,
} from '@backend/systemmessagefactory';
import { SystemConfiguration } from '@backend/systemconfiguration';
import { Database } from './database/database';
import {
  createSystemUser,
  signInSystemUser,
  getSystemuserData,
} from './controller/system-user';
import {
  createApplication,
  getAllApplicationsUserHasAuthorizationFor,
} from './controller/application';
import { SystemUser } from './database/entities/system-user-entity';
import { Application } from './database/entities/application-entity';

const logger: Logger = new Logger('systemdbconnector::index');
const { mhHost, mhPort } = SystemConfiguration.systemmessagehandler;
const messageManager: MessageManager = MessageManager.create({
  hostname: mhHost,
  port: mhPort,
});

startup();

async function startup() {
  await connectToDatabase();

  messageManager.createRPCServer(
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_USER,
    onSystemUserMessage,
  );

  messageManager.createRPCServer(
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
    onApplicationMessage,
  );
}

async function connectToDatabase() {
  const {
    dbHost,
    dbPort,
    dbName,
    dbUsername,
    dbPassword,
  } = SystemConfiguration.systemdbconnector;

  try {
    await Database.connect(dbHost, dbPort, dbName, dbUsername, dbPassword);
    logger.info('connectToDatabase', 'Connected to the system database');
  } catch (exception) {
    logger.error('connectToDatabase', exception.message);
  }
}

async function onSystemUserMessage(requestMessage: RequestMessage) {
  const { type } = requestMessage.meta;

  if (!type) {
    return ErrorMessage.unprocessableEntityErrorResponse();
  }

  switch (type) {
    case SystemUserMessage.TYPE_SYSTEM_USER_CREATE: {
      return createSystemUser(requestMessage.body.data as SystemUser);
    }
    case SystemUserMessage.TYPE_SYSTEM_USER_SIGN_IN: {
      const { data }: any = requestMessage.body;

      return signInSystemUser(data.email, data.password);
    }
    case SystemUserMessage.TYPE_SYSTEM_USER_DATA: {
      const { data }: any = requestMessage.body;

      return getSystemuserData(data.systemUserId);
    }
    default: {
      return ErrorMessage.unprocessableEntityErrorResponse();
    }
  }
}

async function onApplicationMessage(requestMessage: RequestMessage) {
  const { type } = requestMessage.meta;

  if (!type) {
    return ErrorMessage.unprocessableEntityErrorResponse();
  }

  switch (type) {
    case ApplicationMessage.TYPE_APPLICATION_CREATE: {
      return createApplication(requestMessage.body.data as Application);
    }
    case ApplicationMessage.TYPE_APPLICATION_GET_ALL_APPLICATIONS_USER_HAS_AUTHORIZATION_FOR: {
      const { data }: any = requestMessage.body;

      return getAllApplicationsUserHasAuthorizationFor(data.userId);
    }
    default: {
      return ErrorMessage.unprocessableEntityErrorResponse();
    }
  }
}
