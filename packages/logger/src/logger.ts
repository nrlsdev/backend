export const resetEffect: string = '\x1b[0m';

export const brightEffect: string = '\x1b[1m';

export const debugColor: string = `${brightEffect}\x1b[34m`;

export const traceColor: string = `${brightEffect}\x1b[36m`;

export const infoColor: string = `${brightEffect}\x1b[32m`;

export const warnColor: string = `${brightEffect}\x1b[33m`;

export const errorColor: string = `${brightEffect}\x1b[31m`;

export const fatalColor: string = `${brightEffect}\x1b[41m`;

export enum LogType {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

export class Logger {
  private name: string;

  public constructor(name: string) {
    this.name = name;
  }

  public debug(method: string, log: any) {
    // eslint-disable-next-line no-console
    console.debug(
      `${debugColor}[${LogType.DEBUG}]${resetEffect} - ${this.name}::${method}: ${log}`,
    );
  }

  public trace(method: string, log: any) {
    // eslint-disable-next-line no-console
    console.trace(
      `${traceColor}[${LogType.TRACE}]${resetEffect} - ${this.name}::${method}: ${log}`,
    );
  }

  public info(method: string, log: any) {
    // eslint-disable-next-line no-console
    console.info(
      `${infoColor}[${LogType.INFO}]${resetEffect} - ${this.name}::${method}: ${log}`,
    );
  }

  public warn(method: string, log: any) {
    // eslint-disable-next-line no-console
    console.warn(
      `${warnColor}[${LogType.WARN}]${resetEffect} - ${this.name}::${method}: ${log}`,
    );
  }

  public error(method: string, log: any) {
    // eslint-disable-next-line no-console
    console.error(
      `${errorColor}[${LogType.ERROR}]${resetEffect} - ${this.name}::${method}: ${log}`,
    );
  }

  public fatal(method: string, log: any) {
    // eslint-disable-next-line no-console
    console.error(
      `${fatalColor}[${LogType.FATAL}]${resetEffect} - ${this.name}::${method}: ${log}`,
    );
  }
}
