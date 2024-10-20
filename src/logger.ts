// logger.ts

import { pino } from 'pino';
import path from 'path';

import dotevn from 'dotenv';
dotevn.config();

// Log levels based on project requirements
// 0: silent, 1: info, 2: debug, 3: error
const logLevels = ['silent', 'info', 'debug', 'error']

// Determine the log level from the environment variable, default to 'info'
const level: string = process.env.LOG_LEVEL ? logLevels[parseInt(process.env.LOG_LEVEL)] : 'silent';

// Determine the log file path from the environment variable
const logFilePath: string = process.env.LOG_FILE || '';  // Empty means no file, logs go to console

const logger = pino(
  {
    level: level,
  },
  pino.destination({
    dest: logFilePath, // Log file path
    sync: false,       // Asynchronous logging for better performance
  })
);

export default logger;
