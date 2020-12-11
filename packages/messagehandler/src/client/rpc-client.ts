import { Channel, connect, Connection, ConsumeMessage } from 'amqplib';
import { EventEmitter } from 'events';
import { v4 as uuid } from 'uuid';
import { ResponseMessage, MessageHandlerRPCClientConfiguration } from '../..';

// ToDo: Refactor
export class RpcClient {
  private static readonly REPLY_QUEUE = 'amq.rabbitmq.reply-to';

  private static ID_COUNTER = 0;

  private configuration: MessageHandlerRPCClientConfiguration;

  private connection!: Connection;

  private channel!: Channel;

  private responseEmitter!: EventEmitter;

  private constructor(configuration: MessageHandlerRPCClientConfiguration) {
    this.configuration = configuration;

    if (this.configuration.clientId === '') {
      this.configuration.clientId = `${(RpcClient.ID_COUNTER += 1)}`;
    }
  }

  public static create(configuration: MessageHandlerRPCClientConfiguration) {
    const result = new RpcClient(configuration);

    return Promise.resolve()
      .then(() => result.createClient())
      .then(() => result);
  }

  public static resetIdCounter() {
    RpcClient.ID_COUNTER = 0;
  }

  public getId() {
    return this.configuration.clientId;
  }

  public close() {
    return Promise.resolve().then(() => {
      if (this.connection) {
        return this.connection.close();
      }
      return Promise.resolve();
    });
  }

  private createClient() {
    let connection!: Connection;

    return Promise.resolve()
      .then(() => connect(this.configuration.url))
      .then((connectionPromise: Connection) => {
        connection = connectionPromise;
        return connection.createChannel();
      })
      .then((channel: Channel) => {
        this.channel = channel;
        this.responseEmitter = new EventEmitter();
        this.responseEmitter.setMaxListeners(0);
        this.channel.consume(
          RpcClient.REPLY_QUEUE,
          (message: ConsumeMessage | null) => {
            if (message === null) {
              return;
            }
            this.responseEmitter.emit(
              message.properties.correlationId,
              message.content,
            );
          },
          { noAck: true },
        );
      });
  }

  public sendRPCMessage(message: string) {
    const correlationId = uuid();

    return Promise.resolve()
      .then(() => {
        this.channel.sendToQueue(
          this.configuration.rpcQueueType + this.configuration.rpcSeverityType,
          Buffer.from(message),
          {
            // ToDo: Solve severity type with exchanges
            correlationId,
            replyTo: RpcClient.REPLY_QUEUE,
          },
        );
        return new Promise((resolve) => {
          this.responseEmitter.once(correlationId, resolve);
        });
      })
      .then((data: any) => {
        if (data) {
          const responseMessage: ResponseMessage = JSON.parse(
            data.toString(),
          ) as ResponseMessage;
          return responseMessage;
        }
        return {
          meta: {
            statusCode: 422,
            statusMessage: 'Unprocessable Entity',
          },
          body: {},
        };
      });
  }
}
