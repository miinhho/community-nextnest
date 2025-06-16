import { ConsoleLogger, ConsoleLoggerOptions } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

const development: ConsoleLoggerOptions = {
  prefix: 'Backend',
  logLevels: ['error', 'warn', 'log', 'debug'],
  timestamp: true,
};

const production: ConsoleLoggerOptions = {
  prefix: 'Backend',
  logLevels: ['error', 'warn', 'log'],
  timestamp: true,
  json: true,
};

export default registerAs('log', () => ({
  logger: new ConsoleLogger(
    process.env.NODE_ENV === 'production' ? production : development,
  ),
}));
