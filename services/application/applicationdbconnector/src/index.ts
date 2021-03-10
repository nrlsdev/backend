import { Logger } from '@backend/logger';
import {
  MessageManager,
  MessageQueueType,
  MessageSeverityType,
  RequestMessage,
} from '@backend/messagehandler';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { ErrorMessage } from '@backend/applicationmessagefactory';
import { Database } from './database/database';

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

  if (!type) {
    return ErrorMessage.unprocessableEntityErrorResponse();
  }

  switch (type) {
    default: {
      return ErrorMessage.unprocessableEntityErrorResponse(
        `Messgae of type '${type}' not implemented!`,
      );
    }
  }
}
