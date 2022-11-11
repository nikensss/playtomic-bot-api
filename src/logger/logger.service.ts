import { Injectable } from '@nestjs/common';
import { log } from './cls';

export type ClassInstance = { constructor: { name: string } };

@Injectable()
export class LoggerService {
  private context: string | undefined;

  private get logger(): typeof log {
    return log.child({ context: this.context });
  }

  setContext(context: ClassInstance): void {
    this.context = context.constructor.name;
  }

  log(obj: unknown | string, msg?: string, ...args: unknown[]): void {
    this.logger.info(obj, msg, ...args);
  }

  error(obj: unknown | string, msg?: string, ...args: unknown[]): void {
    this.logger.error(obj, msg, ...args);
  }

  warn(obj: unknown | string, msg?: string, ...args: unknown[]): void {
    this.logger.warn(obj, msg, ...args);
  }
}
