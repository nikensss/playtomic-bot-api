import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string(),
        JWT_SECRET: Joi.string(),
        NEW_RELIC_APPLICATION_LOGGING_FORWARDING_ENABLED: Joi.boolean().valid(true),
        NEW_RELIC_APP_NAME: Joi.string(),
        NEW_RELIC_ATTRIBUTES_EXCLUDE: Joi.string().valid(
          'request.headers.cookie,request.headers.authorization,request.headers.proxyAuthorization,request.headers.setCookie*,request.headers.x*,response.headers.cookie,response.headers.authorization,response.headers.proxyAuthorization,response.headers.setCookie*,response.headers.x*',
        ),
        NEW_RELIC_LICENSE_KEY: Joi.string(),
      }),
    }),
    LoggerModule,
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
