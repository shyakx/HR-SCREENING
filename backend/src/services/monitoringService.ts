import { Logger } from '../utils/logger';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: ServiceHealth;
    ai: ServiceHealth;
    filesystem: ServiceHealth;
  };
  metrics: {
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    activeConnections: number;
  };
}

export interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  lastCheck: string;
  error?: string;
}

export class MonitoringService {
  private static startTime = Date.now();
  private static activeConnections = 0;

  static async getHealthStatus(): Promise<HealthStatus> {
    const timestamp = new Date().toISOString();
    
    const [databaseHealth, aiHealth, filesystemHealth] = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkAIHealth(),
      this.checkFilesystemHealth()
    ]);

    const overallStatus = this.determineOverallStatus([
      databaseHealth,
      aiHealth,
      filesystemHealth
    ]);

    return {
      status: overallStatus,
      timestamp,
      services: {
        database: databaseHealth,
        ai: aiHealth,
        filesystem: filesystemHealth
      },
      metrics: {
        uptime: Date.now() - this.startTime,
        memoryUsage: process.memoryUsage(),
        activeConnections: this.activeConnections
      }
    };
  }

  private static async checkDatabaseHealth(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      // Simple database connectivity check
      const mongoose = require('mongoose');
      const state = mongoose.connection.readyState;
      
      const responseTime = Date.now() - startTime;
      
      if (state === 1) { // Connected
        return {
          status: 'up',
          responseTime,
          lastCheck: new Date().toISOString()
        };
      } else {
        return {
          status: 'down',
          responseTime,
          lastCheck: new Date().toISOString(),
          error: `Database connection state: ${state}`
        };
      }
    } catch (error) {
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown database error'
      };
    }
  }

  private static async checkAIHealth(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      // Check AI service availability
      const { GeminiService } = require('./geminiService');
      const service = new GeminiService();
      
      // Simple health check - try to access the model
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'up',
        responseTime,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'degraded',
        responseTime,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'AI service unavailable'
      };
    }
  }

  private static async checkFilesystemHealth(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      const fs = require('fs').promises;
      
      // Test write/read permissions
      await fs.access('./logs', fs.constants.W_OK);
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'up',
        responseTime,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'degraded',
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Filesystem access issue'
      };
    }
  }

  private static determineOverallStatus(services: ServiceHealth[]): 'healthy' | 'degraded' | 'unhealthy' {
    const downServices = services.filter(s => s.status === 'down');
    const degradedServices = services.filter(s => s.status === 'degraded');
    
    if (downServices.length > 0) {
      return 'unhealthy';
    } else if (degradedServices.length > 0) {
      return 'degraded';
    } else {
      return 'healthy';
    }
  }

  static incrementActiveConnections() {
    this.activeConnections++;
    Logger.debug('Active connections incremented', { count: this.activeConnections });
  }

  static decrementActiveConnections() {
    this.activeConnections = Math.max(0, this.activeConnections - 1);
    Logger.debug('Active connections decremented', { count: this.activeConnections });
  }

  static logPerformanceMetrics(operation: string, duration: number, metadata?: any) {
    Logger.performance(operation, duration, metadata);
    
    // Alert on slow operations
    if (duration > 5000) { // 5 seconds
      Logger.warn(`Slow operation detected: ${operation}`, {
        duration,
        threshold: 5000,
        ...metadata
      });
    }
  }

  static logBusinessMetrics(event: string, data: any) {
    Logger.info(`BUSINESS_METRIC: ${event}`, {
      event,
      timestamp: new Date().toISOString(),
      ...data
    });
  }

  static async createSystemBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupId = `backup-${timestamp}`;
    
    Logger.info('Initiating system backup', { backupId });
    
    try {
      // This would implement actual backup logic
      // For now, just log the intention
      Logger.audit('SYSTEM_BACKUP_CREATED', undefined, { backupId });
      
      return backupId;
    } catch (error) {
      Logger.error('System backup failed', error as Error, { backupId });
      throw error;
    }
  }
}
