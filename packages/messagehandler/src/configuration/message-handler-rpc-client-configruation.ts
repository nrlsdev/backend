import { MessageQueueType, MessageSeverityType } from '../..';

export class MessageHandlerRPCClientConfiguration {
  public url: string;

  public rpcQueueType: MessageQueueType;

  public rpcSeverityType: MessageSeverityType;

  public clientId: string;

  public constructor(
    hostname: string,
    port: number,
    rpcQueueType: MessageQueueType,
    rpcSeverityType: MessageSeverityType,
    clientId: string = '',
  ) {
    this.url = `amqp://${hostname}:${port}`;
    this.rpcQueueType = rpcQueueType;
    this.rpcSeverityType = rpcSeverityType;
    this.clientId = clientId;
  }
}
