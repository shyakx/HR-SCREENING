import { Request, Response } from 'express';
import { MonitoringService } from '../services/monitoringService';
import { Logger } from '../utils/logger';

export class HealthController {
  static async getHealth(req: Request, res: Response) {
    try {
      const startTime = Date.now();
      
      const healthStatus = await MonitoringService.getHealthStatus();
      
      const responseTime = Date.now() - startTime;
      MonitoringService.logPerformanceMetrics('health_check', responseTime);
      
      // Set appropriate HTTP status based on health
      let statusCode = 200;
      if (healthStatus.status === 'degraded') statusCode = 200;
      if (healthStatus.status === 'unhealthy') statusCode = 503;
      
      res.status(statusCode).json({
        status: healthStatus.status,
        timestamp: healthStatus.timestamp,
        services: healthStatus.services,
        metrics: {
          uptime: Math.floor(healthStatus.metrics.uptime / 1000), // Convert to seconds
          memoryUsage: {
            rss: Math.round(healthStatus.metrics.memoryUsage.rss / 1024 / 1024), // MB
            heapUsed: Math.round(healthStatus.metrics.memoryUsage.heapUsed / 1024 / 1024), // MB
            heapTotal: Math.round(healthStatus.metrics.memoryUsage.heapTotal / 1024 / 1024), // MB
            external: Math.round(healthStatus.metrics.memoryUsage.external / 1024 / 1024) // MB
          },
          activeConnections: healthStatus.metrics.activeConnections
        },
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      });
      
    } catch (error) {
      Logger.error('Health check failed', error as Error);
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      });
    }
  }

  static async getReadiness(req: Request, res: Response) {
    try {
      // Readiness probe - check if service is ready to accept traffic
      const health = await MonitoringService.getHealthStatus();
      
      const isReady = health.services.database.status === 'up' && 
                     health.services.filesystem.status !== 'down';
      
      if (isReady) {
        res.status(200).json({
          status: 'ready',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          status: 'not_ready',
          timestamp: new Date().toISOString(),
          issues: [
            ...(health.services.database.status !== 'up' ? ['database'] : []),
            ...(health.services.filesystem.status === 'down' ? ['filesystem'] : [])
          ]
        });
      }
    } catch (error) {
      Logger.error('Readiness check failed', error as Error);
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: 'Readiness check failed'
      });
    }
  }

  static async getLiveness(req: Request, res: Response) {
    // Liveness probe - check if service is still alive
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime())
    });
  }

  static async getMetrics(req: Request, res: Response) {
    try {
      const health = await MonitoringService.getHealthStatus();
      
      // Prometheus-style metrics
      const metrics = [
        `# HELP hr_screening_uptime_seconds Total uptime of the service in seconds`,
        `# TYPE hr_screening_uptime_seconds counter`,
        `hr_screening_uptime_seconds ${Math.floor(health.metrics.uptime / 1000)}`,
        '',
        `# HELP hr_screening_memory_bytes Memory usage in bytes`,
        `# TYPE hr_screening_memory_bytes gauge`,
        `hr_screening_memory_bytes{type="rss"} ${health.metrics.memoryUsage.rss}`,
        `hr_screening_memory_bytes{type="heap_used"} ${health.metrics.memoryUsage.heapUsed}`,
        `hr_screening_memory_bytes{type="heap_total"} ${health.metrics.memoryUsage.heapTotal}`,
        '',
        `# HELP hr_screening_active_connections Current number of active connections`,
        `# TYPE hr_screening_active_connections gauge`,
        `hr_screening_active_connections ${health.metrics.activeConnections}`,
        '',
        `# HELP hr_screening_service_up Service health status`,
        `# TYPE hr_screening_service_up gauge`,
        `hr_screening_service_up{service="database"} ${health.services.database.status === 'up' ? 1 : 0}`,
        `hr_screening_service_up{service="ai"} ${health.services.ai.status === 'up' ? 1 : 0}`,
        `hr_screening_service_up{service="filesystem"} ${health.services.filesystem.status === 'up' ? 1 : 0}`
      ].join('\n');

      res.set('Content-Type', 'text/plain');
      res.send(metrics);
      
    } catch (error) {
      Logger.error('Metrics collection failed', error as Error);
      res.status(500).send('# Error collecting metrics');
    }
  }
}
