import {
  MessageQueueType,
  MessageSeverityType,
  RequestMessage,
  ResponseMessage,
} from '../..';

export class MessageHandlerRPCServerConfiguration {
  public url: string;

  public rpcQueueType: MessageQueueType;

  public rpcSeverityType: MessageSeverityType;

  public callback: (requestMessage: RequestMessage) => Promise<ResponseMessage>;

  public serverId: string;

  public constructor(
    hostname: string,
    port: number,
    rpcQueueType: MessageQueueType,
    rpcSeverityType: MessageSeverityType,
    callback: (requestMessage: RequestMessage) => Promise<ResponseMessage>,
    serverId: string = '',
  ) {
    this.url = `amqp://${hostname}:${port}`;
    this.rpcQueueType = rpcQueueType;
    this.rpcSeverityType = rpcSeverityType;
    this.callback = callback;
    this.serverId = serverId;
  }
}
