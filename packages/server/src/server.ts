import express, { Application, json } from 'express';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import { Logger } from '@backend/logger';
import { Server as HTTPServer, createServer as createHTTPServer } from 'http';
import {
  Server as HTTPSServer,
  createServer as createHTTPSServer,
  ServerOptions,
} from 'https';
import expressSession, { SessionOptions } from 'express-session';
import { v4 as uuid } from 'uuid';
import MongoStore from 'connect-mongodb-session';
import { getSSLCert, getSSLKey } from './cert-manager';
import { language } from './middleware/language';

const Store = MongoStore(expressSession);

export interface ServerSessionOptions {
  secret: string;

  resave: boolean;

  saveUninitialized: boolean;

  cookie: {
    maxAge: number;
    httpOnly: boolean;
    secure: boolean;
  };

  mongoSessionStorage: {
    uri: string;

    collection: string;
  };
}

export class Server {
  private static logger: Logger;

  private server: HTTPServer | HTTPSServer;

  private application: Application;

  private host: string;

  private port: number;

  private ssl: boolean;

  private sslOptions: ServerOptions = {};

  public get Application() {
    return this.application;
  }

  public get Host() {
    return this.host;
  }

  public get Port() {
    return this.port;
  }

  public constructor(host: string, port: number, ssl: boolean) {
    Server.logger = new Logger(
      `${host === '' ? 'localhost' : host}:${port}::server`,
    );

    this.application = express();
    this.host = host;
    this.port = port;
    this.ssl = ssl;

    if (this.ssl) {
      this.setSSLOptions(host);
      this.server = createHTTPSServer(this.sslOptions, this.application);
    } else {
      this.server = createHTTPServer(this.application);
    }
  }

  private setSSLOptions(host: string) {
    this.sslOptions = {
      cert: getSSLCert(host),
      key: getSSLKey(host),
      rejectUnauthorized: false,
    };
  }

  public start() {
    this.server.listen(this.port, this.host, this.listen.bind(this));
  }

  private listen() {
    Server.logger.info(
      'listen',
      `Server listening on ${this.ssl ? 'https' : 'http'}://${
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

  public useExpressSession(sessionOptions: ServerSessionOptions) {
    const session: SessionOptions = {
      genid: () => {
        return uuid();
      },
      secret: sessionOptions.secret,
      resave: sessionOptions.resave,
      saveUninitialized: sessionOptions.saveUninitialized,
      cookie: sessionOptions.cookie,
      store: new Store({
        uri: sessionOptions.mongoSessionStorage.uri,
        collection: sessionOptions.mongoSessionStorage.collection,
      }),
    };
    this.application.use(expressSession(session));
  }
}
