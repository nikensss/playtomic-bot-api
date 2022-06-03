import { clsProxify } from 'cls-proxify';
import pino, { stdSerializers } from 'pino';

export const logger = pino({ level: 'info', serializers: { err: stdSerializers.err } });
export const log = clsProxify(logger);
