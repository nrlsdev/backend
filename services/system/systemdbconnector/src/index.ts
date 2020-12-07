import {
  MessageManager,
  MessageQueueType,
  MessageSeverityType,
  RequestMessage,
} from '@backend/messagehandler';
import { SystemUserMessage, ErrorMessage } from '@backend/systemmessagefactory';

const messageManager: MessageManager = MessageManager.create({
  hostname: 'localhost',
  port: 5672,
});

startup();

async function startup() {
  messageManager.createRPCServer(
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_USER,
    onSystemUserMessage,
  );
}

async function onSystemUserMessage(requestMessage: RequestMessage) {
  const { type } = requestMessage.meta;

  if (!type) {
    return ErrorMessage.unprocessableEntityErrorResponse();
  }

  switch (type) {
    case SystemUserMessage.TYPE_SYSTEM_USER_CREATE: {
      // ToDo
      return SystemUserMessage.createdSystemUserResponse(200, 'OK');
    }
    default: {
      return ErrorMessage.unprocessableEntityErrorResponse();
    }
  }
}
