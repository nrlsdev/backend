const resetEffect: string = '\x1b[0m';

const brightEffect: string = '\x1b[1m';

const debugColor: string = `${brightEffect}\x1b[34m`;

const traceColor: string = `${brightEffect}\x1b[36m`;

const infoColor: string = `${brightEffect}\x1b[32m`;

const warnColor: string = `${brightEffect}\x1b[33m`;

const errorColor: string = `${brightEffect}\x1b[31m`;

const fatalColor: string = `${brightEffect}\x1b[41m`;

export class Logger {
  private name: string;

  public constructor(name: string) {
    this.name = name;
  }

  public debug(method: string, log: any) {
    console.debug(
      `${debugColor}[${LogType.DEBUG}]${resetEffect} - ${this.name}::${method}: ${log}`,
    );
  }

  public trace(method: string, log: any) {
    console.trace(
      `${traceColor}[${LogType.TRACE}]${resetEffect} - ${this.name}::${method}: ${log}`,
    );
  }

  public info(method: string, log: any) {
    console.info(
      `${infoColor}[${LogType.INFO}]${resetEffect} - ${this.name}::${method}: ${log}`,
    );
  }

  public warn(method: string, log: any) {
    console.warn(
      `${warnColor}[${LogType.WARN}]${resetEffect} - ${this.name}::${method}: ${log}`,
    );
  }

  public error(method: string, log: any) {
    console.error(
      `${errorColor}[${LogType.ERROR}]${resetEffect} - ${this.name}::${method}: ${log}`,
    );
  }

  public fatal(method: string, log: any) {
    console.error(
      `${fatalColor}[${LogType.FATAL}]${resetEffect} - ${this.name}::${method}: ${log}`,
    );
  }
}

export enum LogType {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}
