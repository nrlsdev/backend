import { Application } from 'express';
import { Server } from '../../src/server';

const host: string = 'localhost';
const port: number = 8080;

let server: Server;
let app: Application;

beforeEach(() => {
  server = new Server(host, port, false); // ToDo: true and false
  app = server.Application;
  app.use = jest.fn();
  app.listen = jest.fn();
});

describe('Server', () => {
  describe('constructor', () => {
    it('should create a server object', () => {
      expect(server.Application).not.toBeNull();
    });
  });

  describe('host', () => {
    it('should return the passed host', () => {
      expect(server.Host).toEqual(host);
    });
  });

  describe('port', () => {
    it('should return the passed port', () => {
      expect(server.Port).toEqual(port);
    });
  });

  describe('.start()', () => {
    it('should start the server and listen have been called one time', () => {
      expect(server.Application.listen).toHaveBeenCalledTimes(0);
      server.start();
      expect(server.Application.listen).toHaveBeenCalledTimes(1);
    });
  });

  describe('.useJsonMiddleware()', () => {
    it('should use json middleware and use function have been called one time', () => {
      expect(server.Application.use).toHaveBeenCalledTimes(0);
      server.useJsonMiddleware();
      expect(server.Application.use).toHaveBeenCalledTimes(1);
    });
  });

  describe('.useCookieParserMiddleware()', () => {
    it('should use cookie parser middleware and use function have been called one time', () => {
      expect(server.Application.use).toHaveBeenCalledTimes(0);
      server.useCookieParserMiddleware();
      expect(server.Application.use).toHaveBeenCalledTimes(1);
    });
  });

  describe('.useCorsMiddleware()', () => {
    it('should use cors middleware and use function have been called one time', () => {
      expect(server.Application.use).toHaveBeenCalledTimes(0);
      server.useCorsMiddleware();
      expect(server.Application.use).toHaveBeenCalledTimes(1);
    });
  });

  describe('.useLanguageMiddleware()', () => {
    it('should use language middleware and use function have been called one time', () => {
      expect(server.Application.use).toHaveBeenCalledTimes(0);
      server.useLanguageMiddleware();
      expect(server.Application.use).toHaveBeenCalledTimes(1);
    });
  });
});
