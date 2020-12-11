import { RpcServer } from './rpc-server';
import {
  MessageSeverityType,
  MessageQueueType,
  ResponseMessage,
  RequestMessage,
  MessageHandlerRPCServerConfiguration,
} from '../..';

export class MessageRPCServer {
  private server: RpcServer;

  private constructor(server: RpcServer) {
    this.server = server;
  }

  public static async create(
    host: string,
    port: number,
    rpcQueueType: MessageQueueType,
    rpcSeverityType: MessageSeverityType,
    callback: (requestMessage: RequestMessage) => Promise<ResponseMessage>,
    serverId: string = '',
  ) {
    const configuration: MessageHandlerRPCServerConfiguration = new MessageHandlerRPCServerConfiguration(
      host,
      port,
      rpcQueueType,
      rpcSeverityType,
      callback,
      serverId,
    );
    const server: RpcServer = await RpcServer.create(configuration);
    return new MessageRPCServer(server);
  }

  public getId() {
    return this.server.getId();
  }

  public async close() {
    await this.server.close();
  }
}
