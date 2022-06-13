import { Injectable } from '@nestjs/common';
import { Logger } from 'pino';
import { log } from './pino-logger-cls';

export type ClassInstance = { constructor: { name: string } };

@Injectable()
export class PinoLoggerService {
  private context: string | undefined;

  private get logger(): Logger {
    return log.child({ context: this.context });
  }

  setContext(context: ClassInstance): void {
    this.context = context.constructor.name;
  }

  log(message: string, ...optionalParams: unknown[]): void {
    this.logger.info(message, ...optionalParams);
  }

  error(message: string, ...optionalParams: unknown[]): void {
    this.logger.error({ err: new Error(message) }, message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: unknown[]): void {
    this.logger.warn(message, ...optionalParams);
  }
}
