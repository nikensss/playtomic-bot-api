import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { PinoLoggerService } from './pino-logger-module/pino-logger/pino-logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly config: ConfigService,
    private readonly appService: AppService,
    private readonly log: PinoLoggerService,
  ) {
    this.log.setContext(this);
  }

  @Get()
  getHello(): string {
    this.log.log('Get hello in controller');
    return this.appService.getHello();
  }

  @Get('/is-dev')
  getIsDev(): boolean {
    return this.config.get('IS_DEV') === 'true';
  }
}
