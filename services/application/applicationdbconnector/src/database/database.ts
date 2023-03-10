import { Logger } from '@backend/logger';
import {
  ConnectionOptions,
  connect as connectToMongo,
  disconnect as disconnectFromMongo,
  connection,
  Schema,
} from 'mongoose';
import { ConnectionState } from './connection-state';
import { ApplicationUserEntity } from './entities/application-user/application-user-entitiy';
import { ApplicationUserSessionEntity } from './entities/application-user-session/application-user-session-entity';

export class Database {
  private static logger: Logger = new Logger('Database');

  private static connectionUrlFormat: string = 'mongodb://{3}:{4}@{0}:{1}/{2}';

  private static mongoClientOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };

  public static applicationUserEntity: ApplicationUserEntity =
    ApplicationUserEntity.Instance;

  public static applicationUserSessionEntity: ApplicationUserSessionEntity =
    ApplicationUserSessionEntity.Instance;

  private static getConnectionUrl(
    urlFormat: string,
    databaseHostname: string,
    databasePort: number,
    databaseName: string,
    databaseUsername: string,
    databasePassword: string,
  ) {
    Schema.Types.String.checkRequired((value) => value != null); // MongoDB shoudl accept empty strings

    const parameters: string[] = [
      databaseHostname,
      databasePort.toString(),
      databaseName,
      databaseUsername,
      databasePassword,
    ];
    let connectionUrl: string = urlFormat;
    for (let i = 0; i < parameters.length; i += 1) {
      connectionUrl = connectionUrl.replace(`{${i}}`, parameters[i]);
    }
    return connectionUrl;
  }

  public static async connect(
    databaseHostname: string,
    databasePort: number,
    databaseName: string,
    databaseUsername: string,
    databasePassword: string,
  ) {
    const connectionState: ConnectionState = Database.getConnectionState();
    if (
      connectionState === ConnectionState.CONNECTING ||
      connectionState === ConnectionState.CONNECTED
    ) {
      throw new Error(
        "Can't connect to the database. There is already an opened connection.",
      );
    }
    const connectionUrl = this.getConnectionUrl(
      Database.connectionUrlFormat,
      databaseHostname,
      databasePort,
      databaseName,
      databaseUsername,
      databasePassword,
    );
    await connectToMongo(connectionUrl, Database.mongoClientOptions);
    connection.once('connected', Database.onConnected.bind(this));
    connection.once('disconnected', Database.onDisconnected.bind(this));
    connection.on('error', Database.onError.bind(this));
  }

  public static async disconnect() {
    const connectionState: ConnectionState = this.getConnectionState();
    if (
      connectionState === ConnectionState.DISCONNECTING ||
      connectionState === ConnectionState.DISCONNECTED
    ) {
      throw new Error(
        "Can't close connection to the database. There is no opened connection.",
      );
    }
    await disconnectFromMongo();
  }

  private static getConnectionState(): ConnectionState {
    const connectionState: ConnectionState = connection.readyState as ConnectionState;
    Database.logger.debug(
      'getConnectionState',
      `ConnectionState is '${connectionState}'`,
    );
    return connectionState;
  }

  private static onConnected() {
    Database.logger.debug('onConnected', 'handle onConnected');
  }

  private static onDisconnected() {
    Database.logger.debug('onDisconnected', 'handle onDisconnected');
  }

  private static onError() {
    Database.logger.debug('onError', 'handle onError');
  }
}
