import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { FastifyRequest } from 'fastify';
import { log } from 'src/pino-logger/pino-logger-cls';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: FastifyRequest, reply: Response, next: () => void): void {
    const start = Date.now();
    const { id: reqId, method, url } = req;

    log.info({ reqId, method, url }, 'request received');
    reply.on('finish', () => {
      const ms = Date.now() - start;
      log.info({ reqId, method, url, ms }, 'request completed');
    });

    next();
  }
}
