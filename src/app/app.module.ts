import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';
import { AuthModule } from 'src/auth/auth.module';
import { DbModule } from 'src/db/db.module';
import { LoggerModule } from 'src/logger/logger.module';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { UsersModule } from 'src/users/users.module';
import { PlaytomicModule } from 'src/playtomic/playtomic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (config: Record<string, unknown>) => {
        return z
          .object({
            DATABASE_URL: z.string(),
            JWT_SECRET: z.string(),
          })
          .parse(config);
      },
    }),
    LoggerModule,
    DbModule,
    AuthModule,
    UsersModule,
    PlaytomicModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
