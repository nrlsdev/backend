import { Channel, connect, Connection, ConsumeMessage } from 'amqplib';
import { RequestMessage, MessageHandlerRPCServerConfiguration } from '..';

// ToDo: Refactor
export class RpcServer {
  private static ID_COUNTER = 0;

  private connection!: Connection;

  private constructor(
    private configuration: MessageHandlerRPCServerConfiguration,
  ) {
    if (this.configuration.serverId === '') {
      this.configuration.serverId = `${(RpcServer.ID_COUNTER += 1)}`;
    }
  }

  public static create(configuration: MessageHandlerRPCServerConfiguration) {
    const result = new RpcServer(configuration);

    return Promise.resolve()
      .then(() => result.consume())
      .then(() => result);
  }

  public static resetIdCounter() {
    RpcServer.ID_COUNTER = 0;
  }

  public getId() {
    return this.configuration.serverId;
  }

  public close() {
    return Promise.resolve().then(() => {
      if (this.connection) {
        return this.connection.close();
      }
      return Promise.resolve();
    });
  }

  private consume() {
    return Promise.resolve()
      .then(() => {
        if (this.connection) {
          return this.connection;
        }

        return connect(this.configuration.url);
      })
      .then((connp: Connection) => {
        this.connection = connp;
        return this.connection.createChannel();
      })
      .then((channel: Channel) => {
        const queue: string =
          this.configuration.rpcQueueType + this.configuration.rpcSeverityType; // ToDo: Solve severity type with exchanges
        channel.assertQueue(queue, {
          durable: false,
        });
        channel.prefetch(1);
        channel.consume(queue, (msg: ConsumeMessage | null) => {
          if (msg === null) {
            return;
          }

          Promise.resolve()
            .then(() => {
              const message: RequestMessage = JSON.parse(
                msg.content.toString(),
              ) as RequestMessage;
              return this.configuration.callback(message);
            })
            .then((data: any) => {
              channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(JSON.stringify(data)),
                { correlationId: msg.properties.correlationId },
              );
              channel.ack(msg);
            });
        });
      });
  }
}
