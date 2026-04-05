import { Request, Response } from 'express';
import { Job } from '../models';
import { body, validationResult } from 'express-validator';

export class JobController {
  static async getAllJobs(req: Request, res: Response) {
    try {
      const { status, department, experienceLevel } = req.query;
      
      const filter: any = {};
      if (status) filter.status = status;
      if (department) filter.department = department;
      if (experienceLevel) filter.experienceLevel = experienceLevel;
      
      const jobs = await Job.find(filter).sort({ createdAt: -1 });
      
      res.json({
        success: true,
        data: jobs,
        count: jobs.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getJobById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const job = await Job.findById(id);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      res.json({
        success: true,
        data: job
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async createJob(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const jobData = req.body;
      const job = new Job(jobData);
      
      await job.save();
      
      res.status(201).json({
        success: true,
        data: job,
        message: 'Job created successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateJob(req: Request, res: Response) {
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
      const updateData = req.body;
      
      const job = await Job.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      res.json({
        success: true,
        data: job,
        message: 'Job updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const job = await Job.findByIdAndDelete(id);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Job deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static validateJob() {
    return [
      body('title').trim().notEmpty().withMessage('Job title is required'),
      body('description').trim().notEmpty().withMessage('Job description is required'),
      body('requirements').isArray({ min: 1 }).withMessage('At least one requirement is required'),
      body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
      body('experienceLevel').isIn(['entry', 'mid', 'senior', 'executive']).withMessage('Invalid experience level'),
      body('location').trim().notEmpty().withMessage('Location is required'),
      body('department').trim().notEmpty().withMessage('Department is required'),
      body('employmentType').isIn(['full-time', 'part-time', 'contract', 'internship']).withMessage('Invalid employment type'),
      body('salaryRange.min').optional().isNumeric().withMessage('Minimum salary must be numeric'),
      body('salaryRange.max').optional().isNumeric().withMessage('Maximum salary must be numeric'),
    ];
  }
}
