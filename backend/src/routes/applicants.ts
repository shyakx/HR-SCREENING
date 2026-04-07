import { Router } from 'express';
import { ApplicantController, uploadMiddleware } from '../controllers/applicantController';

const router = Router();

router.get('/', ApplicantController.getAllApplicants);
router.get('/:id', ApplicantController.getApplicantById);
router.post('/', ApplicantController.validateApplicant(), ApplicantController.createApplicant);
router.put('/:id', ApplicantController.validateApplicant(), ApplicantController.updateApplicant);
router.delete('/:id', ApplicantController.deleteApplicant);
router.post('/upload', uploadMiddleware, ApplicantController.uploadApplicants);
router.post('/upload-resume', uploadMiddleware, ApplicantController.uploadResumePDF);
router.post('/public-apply', ApplicantController.validatePublicApplication(), ApplicantController.createPublicApplication);

export default router;
