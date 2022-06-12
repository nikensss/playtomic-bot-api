import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { clsProxifyFastifyPlugin } from 'cls-proxify/integration/fastify';
import { v4 as uuid } from 'uuid';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { PinoLoggerService } from './pino-logger/pino-logger.service';
import { logger } from './pino-logger/pino-logger-cls';
import { ValidationPipe } from '@nestjs/common';

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
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

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
