import express, { Application, json } from 'express';
import { Logger } from '@backend/logger';

export class Server {
  private static logger: Logger;

  private application: Application;

  private hostname: string;

  private port: number;

  public get Application() {
    return this.application;
  }

  public constructor(hostname: string, port: number) {
    Server.logger = new Logger(
      `${hostname === '' ? 'localhost' : hostname}:${port}::server`,
    );

    this.application = express();
    this.hostname = hostname;
    this.port = port;

    this.initialize();
  }

  private initialize() {
    this.Application.use(json());
  }

  public start() {
    this.Application.listen(this.port, this.hostname, this.listen.bind(this));
  }

  private listen() {
    Server.logger.info(
      'listen',
      `Server listening on http://${
        this.hostname === '' ? 'localhost' : this.hostname
      }:${this.port}`,
    );
  }
}
