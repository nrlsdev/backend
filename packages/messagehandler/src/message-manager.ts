import { Logger } from '@backend/logger';
import {
  MessageRPCServer,
  MessageRPCClient,
  ResponseMessage,
  RequestMessage,
  MessageQueueType,
  MessageSeverityType,
} from '..';

interface MessageManagerConfiguration {
  hostname: string;
  port: number;
}

export class MessageManager {
  private hostname: string = '';

  private port: number = -1;

  private static logger: Logger = new Logger('MessageManager');

  private constructor(config?: MessageManagerConfiguration) {
    if (config) {
      this.hostname = config.hostname;
      this.port = config.port;
    }
  }

  public static create(config: MessageManagerConfiguration) {
    return new MessageManager(config);
  }

  public async createRPCServer(
    rpcQueueType: MessageQueueType,
    rpcSeverityType: MessageSeverityType,
    callback: (requestMessage: RequestMessage) => Promise<ResponseMessage>,
  ) {
    const server: MessageRPCServer = await MessageRPCServer.create(
      this.hostname,
      this.port,
      rpcQueueType,
      rpcSeverityType,
      callback,
    );
    MessageManager.logger.debug('createRPCServer', 'Created rpc server');
    return server;
  }

  public async createRPCClient(
    rpcQueueType: MessageQueueType,
    rpcSeverityType: MessageSeverityType,
  ) {
    const client: MessageRPCClient = await MessageRPCClient.create(
      this.hostname,
      this.port,
      rpcQueueType,
      rpcSeverityType,
    );
    MessageManager.logger.debug(
      'createRPCClient',
      `Created rpc client (${rpcQueueType} - ${rpcSeverityType})`,
    );
    return client;
  }

  public async sendReplyToMessage(
    message: RequestMessage,
    rpcQueueType: MessageQueueType,
    rpcSeverityType: MessageSeverityType,
  ) {
    const client: MessageRPCClient = await this.createRPCClient(
      rpcQueueType,
      rpcSeverityType,
    );
    const responseMessage: ResponseMessage = await client.sendMessage(message);
    MessageManager.logger.debug(
      'sendReplyToMessage',
      `Sent reply to message (${message.meta.type})`,
    );
    await client.close();
    return responseMessage;
  }
}
