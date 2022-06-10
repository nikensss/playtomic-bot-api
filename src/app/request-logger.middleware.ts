import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { FastifyRequest } from 'fastify';
import { log } from 'src/pino-logger/pino-logger-cls';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: FastifyRequest, reply: Response, next: () => void): void {
    const start = Date.now();
    const { id, method, url } = req;

    log.info({ reqId: id, method, url }, 'request received');
    reply.on('finish', () => {
      const responseTime = Date.now() - start;
      log.info({ reqId: id, method, url, responseTime }, 'request completed');
    });

    next();
  }
}
