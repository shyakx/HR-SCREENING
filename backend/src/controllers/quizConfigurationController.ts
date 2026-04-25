import { Request, Response } from 'express';
import { QuizConfiguration } from '../models';
import { body, validationResult } from 'express-validator';

export class QuizConfigurationController {
  /**
   * Get all quiz configurations
   */
  static async getAllConfigurations(req: Request, res: Response) {
    try {
      const configurations = await QuizConfiguration.find({})
        .populate('jobId', 'title department')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: configurations,
        count: configurations.length
      });
    } catch (error) {
      console.error('Error fetching quiz configurations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch quiz configurations'
      });
    }
  }

  /**
   * Get configuration by ID
   */
  static async getConfigurationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const configuration = await QuizConfiguration.findById(id)
        .populate('jobId', 'title department description');

      if (!configuration) {
        return res.status(404).json({
          success: false,
          message: 'Quiz configuration not found'
        });
      }

      res.json({
        success: true,
        data: configuration
      });
    } catch (error) {
      console.error('Error fetching quiz configuration:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch quiz configuration'
      });
    }
  }

  /**
   * Get configuration by job ID
   */
  static async getConfigurationByJob(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const configuration = await QuizConfiguration.findOne({ jobId })
        .populate('jobId', 'title department description');

      if (!configuration) {
        return res.status(404).json({
          success: false,
          message: 'Quiz configuration not found for this job'
        });
      }

      res.json({
        success: true,
        data: configuration
      });
    } catch (error) {
      console.error('Error fetching quiz configuration by job:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch quiz configuration'
      });
    }
  }

  /**
   * Get configurations by role category
   */
  static async getConfigurationsByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const configurations = await QuizConfiguration.find({ 
        roleCategory: category,
        isActive: true 
      }).sort({ createdAt: -1 });

      res.json({
        success: true,
        data: configurations,
        count: configurations.length
      });
    } catch (error) {
      console.error('Error fetching configurations by category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch configurations by category'
      });
    }
  }

  /**
   * Create new quiz configuration
   */
  static async createConfiguration(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const configurationData = req.body;
      
      // Check if configuration already exists for this job
      if (configurationData.jobId) {
        const existing = await QuizConfiguration.findOne({ jobId: configurationData.jobId });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: 'Quiz configuration already exists for this job'
          });
        }
      }

      const configuration = new QuizConfiguration(configurationData);
      await configuration.save();

      const populatedConfig = await QuizConfiguration.findById(configuration._id)
        .populate('jobId', 'title department');

      res.status(201).json({
        success: true,
        message: 'Quiz configuration created successfully',
        data: populatedConfig
      });
    } catch (error) {
      console.error('Error creating quiz configuration:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create quiz configuration'
      });
    }
  }

  /**
   * Update quiz configuration
   */
  static async updateConfiguration(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updates = req.body;

      const configuration = await QuizConfiguration.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      ).populate('jobId', 'title department');

      if (!configuration) {
        return res.status(404).json({
          success: false,
          message: 'Quiz configuration not found'
        });
      }

      res.json({
        success: true,
        message: 'Quiz configuration updated successfully',
        data: configuration
      });
    } catch (error) {
      console.error('Error updating quiz configuration:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update quiz configuration'
      });
    }
  }

  /**
   * Delete quiz configuration
   */
  static async deleteConfiguration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const configuration = await QuizConfiguration.findByIdAndDelete(id);

      if (!configuration) {
        return res.status(404).json({
          success: false,
          message: 'Quiz configuration not found'
        });
      }

      res.json({
        success: true,
        message: 'Quiz configuration deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting quiz configuration:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete quiz configuration'
      });
    }
  }

  /**
   * Toggle configuration active status
   */
  static async toggleConfigurationStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const configuration = await QuizConfiguration.findById(id);

      if (!configuration) {
        return res.status(404).json({
          success: false,
          message: 'Quiz configuration not found'
        });
      }

      configuration.isActive = !configuration.isActive;
      await configuration.save();

      res.json({
        success: true,
        message: `Quiz configuration ${configuration.isActive ? 'activated' : 'deactivated'} successfully`,
        data: configuration
      });
    } catch (error) {
      console.error('Error toggling configuration status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle configuration status'
      });
    }
  }

  /**
   * Duplicate configuration
   */
  static async duplicateConfiguration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const originalConfig = await QuizConfiguration.findById(id);

      if (!originalConfig) {
        return res.status(404).json({
          success: false,
          message: 'Quiz configuration not found'
        });
      }

      // Create a copy without jobId
      const duplicatedConfig = new QuizConfiguration({
        ...originalConfig.toObject(),
        _id: undefined,
        jobId: undefined, // Remove job association for template
        createdAt: undefined,
        updatedAt: undefined,
        isActive: false // Start as inactive
      });

      await duplicatedConfig.save();

      res.status(201).json({
        success: true,
        message: 'Quiz configuration duplicated successfully',
        data: duplicatedConfig
      });
    } catch (error) {
      console.error('Error duplicating configuration:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to duplicate configuration'
      });
    }
  }

  /**
   * Validation middleware
   */
  static validateConfiguration() {
    return [
      body('roleCategory')
        .isIn(['technology', 'sales', 'customer-service', 'finance', 'marketing', 'operations', 'management', 'general'])
        .withMessage('Invalid role category'),
      body('settings.foundationalTier.questionCount')
        .isInt({ min: 1, max: 20 })
        .withMessage('Foundational question count must be between 1 and 20'),
      body('settings.foundationalTier.passingScore')
        .isInt({ min: 0, max: 100 })
        .withMessage('Foundational passing score must be between 0 and 100'),
      body('settings.foundationalTier.timeLimit')
        .isInt({ min: 300, max: 3600 })
        .withMessage('Foundational time limit must be between 300 and 3600 seconds'),
      body('settings.intermediateTier.questionCount')
        .isInt({ min: 1, max: 20 })
        .withMessage('Intermediate question count must be between 1 and 20'),
      body('settings.intermediateTier.passingScore')
        .isInt({ min: 0, max: 100 })
        .withMessage('Intermediate passing score must be between 0 and 100'),
      body('settings.intermediateTier.timeLimit')
        .isInt({ min: 300, max: 3600 })
        .withMessage('Intermediate time limit must be between 300 and 3600 seconds'),
      body('settings.scoring.weights.correctAnswer')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Correct answer weight must be between 0 and 100'),
      body('settings.scoring.weights.timeBonus')
        .isFloat({ min: 0, max: 50 })
        .withMessage('Time bonus weight must be between 0 and 50')
    ];
  }

  static validateUpdate() {
    return [
      body('roleCategory')
        .optional()
        .isIn(['technology', 'sales', 'customer-service', 'finance', 'marketing', 'operations', 'management', 'general'])
        .withMessage('Invalid role category'),
      body('settings.foundationalTier.questionCount')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Foundational question count must be between 1 and 20'),
      body('settings.foundationalTier.passingScore')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Foundational passing score must be between 0 and 100'),
      body('settings.foundationalTier.timeLimit')
        .optional()
        .isInt({ min: 300, max: 3600 })
        .withMessage('Foundational time limit must be between 300 and 3600 seconds'),
      body('settings.intermediateTier.questionCount')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Intermediate question count must be between 1 and 20'),
      body('settings.intermediateTier.passingScore')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Intermediate passing score must be between 0 and 100'),
      body('settings.intermediateTier.timeLimit')
        .optional()
        .isInt({ min: 300, max: 3600 })
        .withMessage('Intermediate time limit must be between 300 and 3600 seconds')
    ];
  }
}
