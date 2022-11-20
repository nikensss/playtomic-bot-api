import { clsProxify } from 'cls-proxify';
import pino, { stdSerializers } from 'pino';

const isDev = process.env.NODE_ENV === 'development';
const prettyLogs = { transport: { target: 'pino-pretty', options: { colorize: true } } };

export const logger = pino({
  enabled: !(process.env.LOGS === 'false'),
  level: 'info',
  serializers: { err: stdSerializers.err },
  ...(isDev ? prettyLogs : {}),
});
export const log = clsProxify(logger);
