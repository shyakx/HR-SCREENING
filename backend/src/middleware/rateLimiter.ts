import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

// Production rate limiting configuration
export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string | object;
  skipSuccessfulRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message as any,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    handler: (req, res) => {
      Logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path,
        method: req.method
      });
      
      res.status(429).json(options.message || {
        success: false,
        error: 'Too many requests, please try again later.',
        type: 'rate_limit_error'
      });
    }
  });
};

// Different rate limits for different endpoints
export const rateLimiters = {
  // General API rate limit
  api: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: 'API rate limit exceeded. Please try again in 15 minutes.',
      type: 'rate_limit_error',
      retryAfter: 900 // 15 minutes in seconds
    }
  }),

  // Strict rate limit for AI screening (expensive operation)
  screening: createRateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20, // Increased to 20 screening requests per 5 minutes
    message: {
      success: false,
      error: 'Screening rate limit exceeded. Please try again in 5 minutes.',
      type: 'screening_rate_limit_error',
      retryAfter: 300 // 5 minutes in seconds
    }
  }),

  // File upload rate limit
  upload: createRateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20, // Limit each IP to 20 uploads per 10 minutes
    message: {
      success: false,
      error: 'Upload rate limit exceeded. Please try again in 10 minutes.',
      type: 'upload_rate_limit_error',
      retryAfter: 600 // 10 minutes in seconds
    }
  }),

  // Health check rate limit (very permissive)
  health: createRateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 300, // Allow 300 health checks per minute
    skipSuccessfulRequests: true // Don't count successful requests
  })
};

// Middleware to track active connections
export const connectionTracker = (req: Request, res: Response, next: NextFunction) => {
  const { MonitoringService } = require('../services/monitoringService');
  
  MonitoringService.incrementActiveConnections();
  
  res.on('finish', () => {
    MonitoringService.decrementActiveConnections();
  });
  
  next();
};
