import { Router } from 'express';
import { ScreeningController } from '../controllers/screeningController';

const router = Router();

router.post('/run', ScreeningController.validateScreening(), ScreeningController.runScreening);
router.get('/results/:jobId', ScreeningController.getScreeningResults);
router.get('/shortlist/:jobId', ScreeningController.generateShortlist);
router.get('/shortlists', ScreeningController.getShortlists);
router.post('/shortlists', ScreeningController.validateShortlist(), ScreeningController.createShortlist);
router.get('/shortlists/:id', ScreeningController.getShortlistById);
router.put('/shortlists/:id', ScreeningController.updateShortlist);
router.delete('/shortlists/:id', ScreeningController.deleteShortlist);

export default router;
