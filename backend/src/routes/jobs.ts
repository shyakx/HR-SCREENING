import { Router } from 'express';
import { JobController } from '../controllers/jobController';

const router = Router();

router.get('/', JobController.getAllJobs);
router.get('/:id', JobController.getJobById);
router.post('/', JobController.validateJob(), JobController.createJob);
router.put('/:id', JobController.validateJob(), JobController.updateJob);
router.delete('/:id', JobController.deleteJob);

export default router;
