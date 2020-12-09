import { Logger } from '@backend/logger';
import {
  MessageManager,
  MessageQueueType,
  MessageSeverityType,
  RequestMessage,
} from '@backend/messagehandler';
import { SystemUserMessage, ErrorMessage } from '@backend/systemmessagefactory';
import { Database } from './database/database';
import { createSystemUser, signInSystemUser } from './controller/system-user';
import { SystemUser } from './database/entities/system-user-entity';

const logger: Logger = new Logger('systemdbconnector::index');
const messageManager: MessageManager = MessageManager.create({
  hostname: 'localhost',
  port: 5672,
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
  try {
    await Database.connect(
      'ckc3fp0ra5nyqrct.myfritz.net',
      37011,
      'devdb',
      'devdb',
      'devdb',
    );
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
    default: {
      return ErrorMessage.unprocessableEntityErrorResponse();
    }
  }
}
