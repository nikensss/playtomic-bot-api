import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PinoLoggerService } from './pino-logger/pino-logger.service';
import { PinoLoggerModuleModule } from './pino-logger-module/pino-logger-module.module';

@Module({
  imports: [PinoLoggerModuleModule],
  controllers: [AppController],
  providers: [AppService, Logger, PinoLoggerService],
})
export class AppModule {}
