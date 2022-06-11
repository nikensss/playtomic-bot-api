import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PinoLoggerModuleModule } from 'src/pino-logger/pino-logger-module.module';
import { PinoLoggerService } from 'src/pino-logger/pino-logger.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';

@Module({
  imports: [
    PinoLoggerModuleModule,
    ConfigModule.forRoot({
      cache: true,
      validationSchema: Joi.object({
        NEW_RELIC_APPLICATION_LOGGING_FORWARDING_ENABLED: Joi.boolean().valid(true),
        NEW_RELIC_APP_NAME: Joi.string().not(''),
        NEW_RELIC_ATTRIBUTES_EXCLUDE: Joi.string().valid(
          'request.headers.cookie,request.headers.authorization,request.headers.proxyAuthorization,request.headers.setCookie*,request.headers.x*,response.headers.cookie,response.headers.authorization,response.headers.proxyAuthorization,response.headers.setCookie*,response.headers.x*',
        ),
        NEW_RELIC_LICENSE_KEY: Joi.string().not(''),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger, PinoLoggerService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
