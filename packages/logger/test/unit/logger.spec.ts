import {
  Logger,
  LogType,
  debugColor,
  traceColor,
  infoColor,
  warnColor,
  errorColor,
  fatalColor,
  resetEffect,
} from '../../src/logger';

const loggerMessage: string = 'Test Message';

describe('Logger', () => {
  describe('.debug()', () => {
    it('should log a message with debug severity', () => {
      const loggerName: string = 'DebugLogger';
      const loggerMethod: string = 'debug';

      const logger: Logger = new Logger(loggerName);
      const consoleMock = jest.spyOn(console, 'debug');

      logger.debug(loggerMethod, loggerMessage);

      expect(consoleMock).toHaveBeenCalledWith(
        `${debugColor}[${LogType.DEBUG}]${resetEffect} - ${loggerName}::${loggerMethod}: ${loggerMessage}`,
      );
    });
  });

  describe('.trace()', () => {
    it('should log a message with trace severity', () => {
      const loggerName: string = 'TraceLogger';
      const loggerMethod: string = 'trace';

      const logger: Logger = new Logger(loggerName);
      const consoleMock = jest.spyOn(console, 'trace');

      logger.trace(loggerMethod, loggerMessage);

      expect(consoleMock).toHaveBeenCalledWith(
        `${traceColor}[${LogType.TRACE}]${resetEffect} - ${loggerName}::${loggerMethod}: ${loggerMessage}`,
      );
    });
  });

  describe('.info()', () => {
    it('should log a message with info severity', () => {
      const loggerName: string = 'InfoLogger';
      const loggerMethod: string = 'info';

      const logger: Logger = new Logger(loggerName);
      const consoleMock = jest.spyOn(console, 'info');

      logger.info(loggerMethod, loggerMessage);

      expect(consoleMock).toHaveBeenCalledWith(
        `${infoColor}[${LogType.INFO}]${resetEffect} - ${loggerName}::${loggerMethod}: ${loggerMessage}`,
      );
    });
  });

  describe('.warn()', () => {
    it('should log a message with warn severity', () => {
      const loggerName: string = 'WarnLogger';
      const loggerMethod: string = 'warn';

      const logger: Logger = new Logger(loggerName);
      const consoleMock = jest.spyOn(console, 'warn');

      logger.warn(loggerMethod, loggerMessage);

      expect(consoleMock).toHaveBeenCalledWith(
        `${warnColor}[${LogType.WARN}]${resetEffect} - ${loggerName}::${loggerMethod}: ${loggerMessage}`,
      );
    });
  });

  describe('.error()', () => {
    it('should log a message with error severity', () => {
      const loggerName: string = 'ErrorLogger';
      const loggerMethod: string = 'error';

      const logger: Logger = new Logger(loggerName);
      const consoleMock = jest.spyOn(console, 'error');

      logger.error(loggerMethod, loggerMessage);

      expect(consoleMock).toHaveBeenCalledWith(
        `${errorColor}[${LogType.ERROR}]${resetEffect} - ${loggerName}::${loggerMethod}: ${loggerMessage}`,
      );
    });
  });

  describe('.fatal()', () => {
    it('should log a message with fatal severity', () => {
      const loggerName: string = 'FatalLogger';
      const loggerMethod: string = 'fatal';

      const logger: Logger = new Logger(loggerName);
      const consoleMock = jest.spyOn(console, 'error');

      logger.fatal(loggerMethod, loggerMessage);

      expect(consoleMock).toHaveBeenCalledWith(
        `${fatalColor}[${LogType.FATAL}]${resetEffect} - ${loggerName}::${loggerMethod}: ${loggerMessage}`,
      );
    });
  });
});
