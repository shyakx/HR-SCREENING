import { Router } from 'express';
import { QuizConfigurationController } from '../controllers/quizConfigurationController';

const router = Router();

// Quiz configuration CRUD operations
router.get('/', QuizConfigurationController.getAllConfigurations);
router.get('/:id', QuizConfigurationController.getConfigurationById);
router.get('/category/:category', QuizConfigurationController.getConfigurationsByCategory);
router.get('/job/:jobId', QuizConfigurationController.getConfigurationByJob);
router.post('/', QuizConfigurationController.validateConfiguration(), QuizConfigurationController.createConfiguration);
router.put('/:id', QuizConfigurationController.validateUpdate(), QuizConfigurationController.updateConfiguration);
router.delete('/:id', QuizConfigurationController.deleteConfiguration);

// Configuration management
router.patch('/:id/toggle', QuizConfigurationController.toggleConfigurationStatus);
router.post('/:id/duplicate', QuizConfigurationController.duplicateConfiguration);

export default router;
