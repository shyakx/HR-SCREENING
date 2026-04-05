import winston from 'winston';

// Production-ready logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'hr-screening-api' },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write error logs to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export class Logger {
  static info(message: string, meta?: any) {
    logger.info(message, meta);
  }

  static error(message: string, error?: Error, meta?: any) {
    logger.error(message, { 
      error: error?.message, 
      stack: error?.stack,
      ...meta 
    });
  }

  static warn(message: string, meta?: any) {
    logger.warn(message, meta);
  }

  static debug(message: string, meta?: any) {
    logger.debug(message, meta);
  }

  static audit(action: string, userId?: string, meta?: any) {
    logger.info(`AUDIT: ${action}`, {
      action,
      userId,
      timestamp: new Date().toISOString(),
      ...meta
    });
  }

  static performance(operation: string, duration: number, meta?: any) {
    logger.info(`PERFORMANCE: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ...meta
    });
  }
}

export default Logger;
