import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './utils/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import { rateLimiters, connectionTracker } from './middleware/rateLimiter';
import { Logger } from './utils/logger';
import { MonitoringService } from './services/monitoringService';

// Route imports
import jobRoutes from './routes/jobs';
import applicantRoutes from './routes/applicants';
import screeningRoutes from './routes/screening';
import healthRoutes from './routes/health';

// Load environment variables
dotenv.config();

const app = express();

// Connect to database
connectDB();

// Production middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(connectionTracker);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check routes (no rate limiting)
app.use('/health', healthRoutes);

// API routes with specific rate limiting
app.use('/api/jobs', rateLimiters.api, jobRoutes);
app.use('/api/applicants', rateLimiters.api, applicantRoutes);
app.use('/api/screening', rateLimiters.screening, screeningRoutes);

// File upload specific rate limiting
app.use('/api/applicants/upload', rateLimiters.upload);
app.use('/api/applicants/upload-resume', rateLimiters.upload);

// Root endpoint
app.get('/api', (req, res) => {
  Logger.info('API root accessed', { ip: req.ip });
  res.json({
    success: true,
    message: 'HR Screening API v1.0.0',
    version: '1.0.0',
    endpoints: {
      jobs: '/api/jobs',
      applicants: '/api/applicants',
      screening: '/api/screening',
      health: '/health'
    },
    documentation: '/health',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  Logger.info(`Production server started`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    pid: process.pid
  });
  
  MonitoringService.logBusinessMetrics('SERVER_STARTED', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  Logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  Logger.error('Uncaught exception', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  Logger.error('Unhandled promise rejection', new Error(reason as string), { promise });
  process.exit(1);
});

export default app;
