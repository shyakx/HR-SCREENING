import { Router } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();

// Health check endpoint
router.get('/', HealthController.getHealth);

// Kubernetes/Docker readiness probe
router.get('/ready', HealthController.getReadiness);

// Kubernetes/Docker liveness probe
router.get('/live', HealthController.getLiveness);

// Prometheus metrics endpoint
router.get('/metrics', HealthController.getMetrics);

export default router;
