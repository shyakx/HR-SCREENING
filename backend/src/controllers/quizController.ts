import { Request, Response } from 'express';
import { QuizQuestion, QuizAttempt, QuizConfiguration, Job } from '../models';
import { QuizService } from '../services/quizService';
import { body, validationResult } from 'express-validator';

export class QuizController {
  private quizService: QuizService;

  constructor() {
    this.quizService = new QuizService();
  }

  // Get quiz configuration for a job
  static async getQuizConfiguration(req: Request, res: Response) {
    try {
      const { jobId } = req.params;

      const config = await QuizConfiguration.findOne({ jobId }).populate('jobId');
      
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Quiz configuration not found'
        });
      }

      res.json({
        success: true,
        data: config
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching quiz configuration',
        error: error.message
      });
    }
  }

  // Create or update quiz configuration
  static async upsertQuizConfiguration(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { jobId } = req.params;
      const configData = req.body;

      // Verify job exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      const config = await QuizConfiguration.findOneAndUpdate(
        { jobId },
        { ...configData, jobId },
        { upsert: true, new: true }
      ).populate('jobId');

      res.json({
        success: true,
        message: 'Quiz configuration saved successfully',
        data: config
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error saving quiz configuration',
        error: error.message
      });
    }
  }

  // Start a quiz attempt
  static async startQuizAttempt(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { jobId, applicantId } = req.body;
      const quizService = new QuizService();

      const attempt = await quizService.startQuizAttempt(jobId, applicantId);

      res.status(201).json({
        success: true,
        message: 'Quiz started successfully',
        data: {
          quizSessionId: attempt.quizSessionId,
          tier: attempt.tier,
          questions: attempt.questions.map((q: any) => ({
            questionId: q.questionId,
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.questionType === 'multiple-choice' ? q.options : undefined,
            timeLimit: q.timeLimit,
            points: q.points,
          })),
          timeLimit: attempt.tier === 'foundational' ? 600 : 900, // 10 or 15 minutes
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error starting quiz',
        error: error.message
      });
    }
  }

  // Submit answer to a question
  static async submitAnswer(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { quizSessionId, questionIndex, answer, timeTaken } = req.body;
      const quizService = new QuizService();

      const result = await quizService.submitAnswer(
        quizSessionId, 
        questionIndex, 
        answer, 
        timeTaken
      );

      res.json({
        success: true,
        message: 'Answer submitted successfully',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error submitting answer',
        error: error.message
      });
    }
  }

  // Complete quiz attempt
  static async completeQuizAttempt(req: Request, res: Response) {
    try {
      const { quizSessionId } = req.params;
      const quizService = new QuizService();

      const result = await quizService.completeQuizAttempt(quizSessionId);

      res.json({
        success: true,
        message: 'Quiz completed successfully',
        data: {
          quizSessionId: result.quizSessionId,
          status: result.status,
          scores: result.scores,
          recommendation: result.recommendation,
          analytics: result.analytics,
          crossReference: result.crossReference,
          completedAt: result.progression.completedAt,
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error completing quiz',
        error: error.message
      });
    }
  }

  // Progress to intermediate tier
  static async progressToIntermediate(req: Request, res: Response) {
    try {
      const { quizSessionId } = req.params;
      const quizService = new QuizService();

      const result = await quizService.progressToIntermediate(quizSessionId);

      res.json({
        success: true,
        message: 'Progressed to intermediate tier',
        data: {
          quizSessionId: result.quizSessionId,
          tier: result.tier,
          questions: result.questions.map((q: any) => ({
            questionId: q.questionId,
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.questionType === 'multiple-choice' ? q.options : undefined,
            timeLimit: q.timeLimit,
            points: q.points,
          })),
          timeLimit: 900, // 15 minutes for intermediate
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error progressing to intermediate tier',
        error: error.message
      });
    }
  }

  // Get quiz attempt status
  static async getQuizAttemptStatus(req: Request, res: Response) {
    try {
      const { quizSessionId } = req.params;

      const attempt = await QuizAttempt.findOne({ quizSessionId })
        .populate('jobId')
        .populate('applicantId');

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: 'Quiz attempt not found'
        });
      }

      res.json({
        success: true,
        data: {
          quizSessionId: attempt.quizSessionId,
          status: attempt.status,
          tier: attempt.tier,
          scores: attempt.scores,
          progression: attempt.progression,
          currentQuestionIndex: attempt.questions.findIndex(q => !q.userAnswer),
          totalQuestions: attempt.questions.length,
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching quiz status',
        error: error.message
      });
    }
  }

  // Get quiz results for HR review
  static async getQuizResults(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const { status, fitLevel } = req.query;

      const filter: any = { jobId };
      if (status) filter.status = status;
      if (fitLevel) filter['recommendation.fitLevel'] = fitLevel;

      const attempts = await QuizAttempt.find(filter)
        .populate('applicantId')
        .populate('jobId')
        .sort({ 'progression.completedAt': -1 });

      res.json({
        success: true,
        data: attempts
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching quiz results',
        error: error.message
      });
    }
  }

  // Get detailed quiz attempt analysis
  static async getQuizAttemptAnalysis(req: Request, res: Response) {
    try {
      const { quizSessionId } = req.params;

      const attempt = await QuizAttempt.findOne({ quizSessionId })
        .populate('applicantId')
        .populate('jobId')
        .populate('questions.questionId');

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: 'Quiz attempt not found'
        });
      }

      res.json({
        success: true,
        data: attempt
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching quiz analysis',
        error: error.message
      });
    }
  }

  // Quiz Question Management
  static async getQuizQuestions(req: Request, res: Response) {
    try {
      const { 
        roleCategory, 
        difficulty, 
        questionType, 
        skills, 
        page = 1, 
        limit = 20 
      } = req.query;

      const filter: any = { isActive: true };
      if (roleCategory) filter.roleCategory = roleCategory;
      if (difficulty) filter.difficulty = difficulty;
      if (questionType) filter.questionType = questionType;
      if (skills) {
        const skillArray = Array.isArray(skills) ? skills : [skills];
        filter.skills = { $in: skillArray };
      }

      const questions = await QuizQuestion.find(filter)
        .sort({ 'usage.timesUsed': 1, createdAt: -1 })
        .limit(parseInt(limit as string) * 1)
        .skip((parseInt(page as string) - 1) * parseInt(limit as string));

      const total = await QuizQuestion.countDocuments(filter);

      res.json({
        success: true,
        data: questions,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching quiz questions',
        error: error.message
      });
    }
  }

  static async createQuizQuestion(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const questionData = req.body;
      const question = new QuizQuestion(questionData);

      await question.save();

      res.status(201).json({
        success: true,
        message: 'Quiz question created successfully',
        data: question
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error creating quiz question',
        error: error.message
      });
    }
  }

  static async updateQuizQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const question = await QuizQuestion.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Quiz question not found'
        });
      }

      res.json({
        success: true,
        message: 'Quiz question updated successfully',
        data: question
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error updating quiz question',
        error: error.message
      });
    }
  }

  static async deleteQuizQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const question = await QuizQuestion.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Quiz question not found'
        });
      }

      res.json({
        success: true,
        message: 'Quiz question deactivated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error deactivating quiz question',
        error: error.message
      });
    }
  }

  // Validation middleware
  static validateStartQuiz() {
    return [
      body('jobId')
        .notEmpty()
        .withMessage('Job ID is required')
        .isMongoId()
        .withMessage('Invalid Job ID format'),
      body('applicantId')
        .notEmpty()
        .withMessage('Applicant ID is required')
        .isMongoId()
        .withMessage('Invalid Applicant ID format')
    ];
  }

  static validateSubmitAnswer() {
    return [
      body('quizSessionId')
        .notEmpty()
        .withMessage('Quiz session ID is required'),
      body('questionIndex')
        .isInt({ min: 0 })
        .withMessage('Question index must be a non-negative integer'),
      body('answer')
        .notEmpty()
        .withMessage('Answer is required'),
      body('timeTaken')
        .isInt({ min: 0 })
        .withMessage('Time taken must be a non-negative integer')
    ];
  }

  static validateQuizConfiguration() {
    return [
      body('roleCategory')
        .isIn(['technology', 'sales', 'customer-service', 'finance', 'marketing', 'operations', 'management', 'general'])
        .withMessage('Invalid role category'),
      body('settings.foundationalTier.questionCount')
        .isInt({ min: 1, max: 10 })
        .withMessage('Foundational question count must be between 1 and 10'),
      body('settings.foundationalTier.passingScore')
        .isInt({ min: 0, max: 100 })
        .withMessage('Foundational passing score must be between 0 and 100'),
      body('settings.intermediateTier.questionCount')
        .isInt({ min: 1, max: 10 })
        .withMessage('Intermediate question count must be between 1 and 10'),
      body('settings.intermediateTier.passingScore')
        .isInt({ min: 0, max: 100 })
        .withMessage('Intermediate passing score must be between 0 and 100')
    ];
  }

  static validateQuizQuestion() {
    return [
      body('roleCategory')
        .isIn(['technology', 'sales', 'customer-service', 'finance', 'marketing', 'operations', 'management', 'general'])
        .withMessage('Invalid role category'),
      body('difficulty')
        .isIn(['foundational', 'intermediate', 'advanced'])
        .withMessage('Invalid difficulty level'),
      body('questionType')
        .isIn(['scenario', 'multiple-choice', 'short-answer', 'practical'])
        .withMessage('Invalid question type'),
      body('question')
        .notEmpty()
        .withMessage('Question is required'),
      body('correctAnswer')
        .notEmpty()
        .withMessage('Correct answer is required'),
      body('explanation')
        .notEmpty()
        .withMessage('Explanation is required'),
      body('skills')
        .isArray({ min: 1 })
        .withMessage('At least one skill is required'),
      body('timeLimit')
        .isInt({ min: 30, max: 600 })
        .withMessage('Time limit must be between 30 and 600 seconds'),
      body('points')
        .isInt({ min: 1, max: 100 })
        .withMessage('Points must be between 1 and 100')
    ];
  }
}
