import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PinoLoggerService } from './pino-logger/pino-logger.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly log: PinoLoggerService) {
    this.log.setContext(this);
  }

  @Get()
  getHello(): string {
    this.log.log('Get hello in controller');
    return this.appService.getHello();
  }
}
