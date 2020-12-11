import { RpcClient } from './rpc-client';
import {
  MessageQueueType,
  RequestMessage,
  ResponseMessage,
  MessageSeverityType,
  MessageHandlerRPCClientConfiguration,
} from '../..';

export class MessageRPCClient {
  private client: RpcClient;

  private constructor(client: RpcClient) {
    this.client = client;
  }

  public static async create(
    hostname: string,
    port: number,
    rpcQueueType: MessageQueueType,
    rpcSeverityType: MessageSeverityType,
    clientId: string = '',
  ) {
    const configuration: MessageHandlerRPCClientConfiguration = new MessageHandlerRPCClientConfiguration(
      hostname,
      port,
      rpcQueueType,
      rpcSeverityType,
      clientId,
    );
    const client: RpcClient = await RpcClient.create(configuration);
    return new MessageRPCClient(client);
  }

  public async sendMessage(message: RequestMessage) {
    const responseMessage: ResponseMessage = await this.client.sendRPCMessage(
      JSON.stringify(message),
    );
    return responseMessage;
  }

  public getId() {
    return this.client.getId();
  }

  public async close() {
    await this.client.close();
  }
}
