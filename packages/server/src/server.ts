import express, { Application } from 'express';
import { Logger } from '@backend/logger';

export class Server {
  private logger: Logger;

  private application: Application;

  private hostname: string;

  private port: number;

  public get Application() {
    return this.application;
  }

  public constructor(hostname: string, port: number) {
    this.logger = new Logger(
      `${hostname === '' ? 'localhost' : hostname}:${port}::server`,
    );
    this.application = express();
    this.hostname = hostname;
    this.port = port;
  }

  public start() {
    this.Application.listen(this.port, this.hostname, this.listen.bind(this));
  }

  private listen() {
    this.logger.info(
      'listen',
      `Server listening on http://${
        this.hostname === '' ? 'localhost' : this.hostname
      }:${this.port}`,
    );
  }
}
