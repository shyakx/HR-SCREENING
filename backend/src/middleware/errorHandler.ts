import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  let error = { ...err };
  error.message = err.message;

  // Log error with context
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, {
    message: err.message,
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { ...error, message, name: 'CastError' };
    return res.status(404).json({
      success: false,
      error: message,
      type: 'validation_error'
    });
  }

  // Mongoose duplicate key
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = { ...error, message, name: 'MongoError' };
    return res.status(400).json({
      success: false,
      error: message,
      type: 'duplicate_error'
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message).join(', ');
    error = { ...error, message, name: 'ValidationError' };
    return res.status(400).json({
      success: false,
      error: message,
      type: 'validation_error'
    });
  }

  // AI Service errors
  if (err.message.includes('Gemini') || err.message.includes('AI service')) {
    const message = 'AI service temporarily unavailable. Please try again later.';
    return res.status(503).json({
      success: false,
      error: message,
      type: 'ai_service_error',
      retryable: true
    });
  }

  // Rate limit errors
  if (err.message.includes('429') || err.message.includes('rate limit')) {
    const message = 'Too many requests. Please wait before trying again.';
    return res.status(429).json({
      success: false,
      error: message,
      type: 'rate_limit_error',
      retryable: true
    });
  }

  // File upload errors
  if (err.message.includes('PDF') || err.message.includes('file') || err.message.includes('upload')) {
    const message = 'File processing failed. Please check the file format and try again.';
    return res.status(400).json({
      success: false,
      error: message,
      type: 'file_error'
    });
  }

  // Default error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    error: error.message || 'Server Error',
    type: 'server_error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
