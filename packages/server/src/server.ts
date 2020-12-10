import express, { Application, json } from 'express';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
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

  public useJsonMiddleware() {
    this.Application.use(json());
  }

  public useCookieParser() {
    this.application.use(cookieParser());
  }

  public useCors(opions?: CorsOptions) {
    this.application.use(cors(opions));
  }
}
