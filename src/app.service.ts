import { Injectable } from '@nestjs/common';
import { PinoLoggerService } from './pino-logger/pino-logger.service';

@Injectable()
export class AppService {
  constructor(private readonly log: PinoLoggerService) {
    this.log.setContext(this);
  }

  getHello(): string {
    this.log.log('Get hello from service');
    return 'Hello World!';
  }
}
