import {
  MessageManager,
  MessageQueueType,
  MessageSeverityType,
  RequestMessage,
  ResponseMessage,
} from '@backend/messagehandler';

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
  const responseMessage: ResponseMessage = {};

  console.log(requestMessage);

  return responseMessage;
}
