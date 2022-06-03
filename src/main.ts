import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { PinoLoggerService } from './pino-logger/pino-logger.service';
import { clsProxifyFastifyPlugin } from 'cls-proxify/integration/fastify';
import { v4 as uuid } from 'uuid';
import { logger } from './pino-logger/pino-logger-cls';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId: (): string => uuid(),
    }),
    {
      bufferLogs: true,
      logger: new PinoLoggerService(),
    },
  );

  await app.register(clsProxifyFastifyPlugin, {
    proxify: ({ id, url }) => logger.child({ reqId: id, url }),
  });

  await app.listen(3000, '0.0.0.0');
}

const retry = (): void => {
  bootstrap().catch(ex => {
    console.error(ex);
    retry();
  });
};

retry();
