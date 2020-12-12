import express, { Application, json } from 'express';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import { Logger } from '@backend/logger';
import { language } from './middleware/language';

export class Server {
  private static logger: Logger;

  private application: Application;

  private host: string;

  private port: number;

  public get Application() {
    return this.application;
  }

  public get Host() {
    return this.host;
  }

  public get Port() {
    return this.port;
  }

  public constructor(host: string, port: number) {
    Server.logger = new Logger(
      `${host === '' ? 'localhost' : host}:${port}::server`,
    );

    this.application = express();
    this.host = host;
    this.port = port;
  }

  public start() {
    this.Application.listen(this.port, this.host, this.listen.bind(this));
  }

  private listen() {
    Server.logger.info(
      'listen',
      `Server listening on http://${
        this.host === '' ? 'localhost' : this.host
      }:${this.port}`,
    );
  }

  public useJsonMiddleware() {
    this.Application.use(json());
  }

  public useCookieParserMiddleware() {
    this.application.use(cookieParser());
  }

  public useCorsMiddleware(options?: CorsOptions) {
    const serverCors = cors(options);

    this.application.use(serverCors);
  }

  public useLanguageMiddleware() {
    this.application.use(language);
  }
}
