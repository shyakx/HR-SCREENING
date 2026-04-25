import { Router } from 'express';
import { QuizController } from '../controllers/quizController';

const router = Router();

// Quiz Configuration Routes
router.get('/config/:jobId', QuizController.getQuizConfiguration);
router.put('/config/:jobId', QuizController.upsertQuizConfiguration);

// Quiz Attempt Routes
router.post('/start', QuizController.validateStartQuiz(), QuizController.startQuizAttempt);
router.post('/answer', QuizController.validateSubmitAnswer(), QuizController.submitAnswer);
router.post('/complete/:quizSessionId', QuizController.completeQuizAttempt);
router.post('/progress/:quizSessionId', QuizController.progressToIntermediate);
router.get('/status/:quizSessionId', QuizController.getQuizAttemptStatus);

// Quiz Results Routes
router.get('/results/:jobId', QuizController.getQuizResults);
router.get('/analysis/:quizSessionId', QuizController.getQuizAttemptAnalysis);

// Quiz Question Management Routes
router.get('/questions', QuizController.getQuizQuestions);
router.post('/questions', QuizController.validateQuizQuestion(), QuizController.createQuizQuestion);
router.put('/questions/:id', QuizController.updateQuizQuestion);
router.delete('/questions/:id', QuizController.deleteQuizQuestion);

export default router;
