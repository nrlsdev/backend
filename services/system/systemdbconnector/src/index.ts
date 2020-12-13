import { Logger } from '@backend/logger';
import {
  MessageManager,
  MessageQueueType,
  MessageSeverityType,
  RequestMessage,
} from '@backend/messagehandler';
import { SystemUserMessage, ErrorMessage } from '@backend/systemmessagefactory';
import { SystemConfiguration } from '@backend/systemconfiguration';
import { Database } from './database/database';
import {
  createSystemUser,
  signInSystemUser,
  getSystemuserData,
} from './controller/system-user';
import { SystemUser } from './database/entities/system-user-entity';

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
