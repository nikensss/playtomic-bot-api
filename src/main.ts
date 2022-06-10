import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { clsProxifyFastifyPlugin } from 'cls-proxify/integration/fastify';
import { v4 as uuid } from 'uuid';
import { PinoLoggerService } from './pino-logger-module/pino-logger/pino-logger.service';
import { logger } from './pino-logger-module/pino-logger/pino-logger-cls';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Nest.js template')
    .setDescription('The nest.js template API')
    .setVersion('0.1.0')
    .addTag('template')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc);

  await app.listen(3000, '0.0.0.0');
}

const retry = (): void => {
  bootstrap().catch(ex => {
    logger.error({ err: ex });
    retry();
  });
};

retry();
