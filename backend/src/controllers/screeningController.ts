import { Request, Response } from 'express';
import { Job, Applicant, ScreeningResult, Shortlist } from '../models';
import { GeminiService } from '../services/geminiService';
import { LocalScoringService } from '../services/localScoringService';
import { body, validationResult } from 'express-validator';

export class ScreeningController {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  static async runScreening(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { jobId, applicantIds } = req.body;
      
      // Get job details
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Get applicants who applied for this specific job
      const applicants = await Applicant.find({ 
        _id: { $in: applicantIds },
        appliedJobs: jobId 
      });
      
      if (applicants.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No applicants found who applied for this position'
        });
      }
      
      console.log(`[DEBUG] Found ${applicants.length} applicants who applied for this job`);

      // Initialize Gemini service and run screening
      const geminiService = new GeminiService();
      let screeningResults;
      
      try {
        screeningResults = await geminiService.screenCandidates(job, applicants);
        console.log('[DEBUG] Gemini returned:', screeningResults.length, 'results');
        console.log('[DEBUG] First result sample:', screeningResults[0] ? { matchScore: screeningResults[0].matchScore, rank: screeningResults[0].rank, applicantIndex: screeningResults[0].applicantIndex, skillAlignmentType: typeof screeningResults[0].skillAlignment } : 'none');
      } catch (geminiError: any) {
        console.log('[DEBUG] Gemini failed, falling back to local scoring:', geminiError.message);
        
        // Fallback to local scoring service
        screeningResults = LocalScoringService.scoreCandidates(job, applicants);
        console.log('[DEBUG] Local scoring returned:', screeningResults.length, 'results');
      }

      // Clear previous screening results for this job
      await ScreeningResult.deleteMany({ jobId });

      // Save new screening results
      const savedResults = [];
      for (let i = 0; i < screeningResults.length; i++) {
        const result = screeningResults[i];
        const applicantIndex = result.applicantIndex - 1; // Convert from 1-based to 0-based
        const applicant = applicants[applicantIndex];

        // Convert to plain object for database storage
        console.log('[DEBUG] Processing result', i, 'applicantIndex:', result.applicantIndex, 'applicant found:', !!applicant);
        console.log('[DEBUG] skillAlignment type:', typeof result.skillAlignment, 'is Map:', result.skillAlignment instanceof Map);
        const skillAlignmentData = result.skillAlignment instanceof Map 
          ? Object.fromEntries(result.skillAlignment)
          : result.skillAlignment;

        const screeningResult = new ScreeningResult({
          jobId: job._id,
          applicantId: applicant._id,
          matchScore: result.matchScore,
          rank: result.rank,
          strengths: result.strengths,
          gaps: result.gaps,
          recommendation: result.recommendation,
          reasoning: result.reasoning,
          skillAlignment: skillAlignmentData,
        });

        await screeningResult.save();
        console.log('[DEBUG] Saved screening result with ID:', screeningResult._id);
        
        // Populate applicant data before pushing to results
        await screeningResult.populate('applicantId');
        console.log('[DEBUG] Populated applicantId:', screeningResult.applicantId ? (screeningResult.applicantId as any).name : 'null');
        
        savedResults.push(screeningResult);
      }

      console.log('[DEBUG] Returning', savedResults.length, 'results to frontend');
      console.log('[DEBUG] First saved result:', savedResults[0] ? { _id: savedResults[0]._id, matchScore: savedResults[0].matchScore, applicantId: savedResults[0].applicantId } : 'none');

      res.json({
        success: true,
        data: savedResults,
        message: `Screening completed for ${savedResults.length} applicants`
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async generateShortlist(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const { shortlistType = 'top10', minScore = 60 } = req.query;

      // Get all screening results for this job, sorted by rank
      const allResults = await ScreeningResult.find({ jobId })
        .populate('applicantId')
        .sort({ rank: 1 });

      if (allResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No screening results found for this job'
        });
      }

      // Determine shortlist size based on type
      let shortlistSize = 10;
      if (shortlistType === 'top20') shortlistSize = 20;
      if (shortlistType === 'top5') shortlistSize = 5;
      if (shortlistType === 'all') shortlistSize = allResults.length;

      // Filter by minimum score and take top candidates
      const shortlist = allResults
        .filter(result => result.matchScore >= (minScore as number))
        .slice(0, shortlistSize);

      // Calculate shortlist statistics
      const stats = {
        totalCandidates: allResults.length,
        shortlistedCandidates: shortlist.length,
        averageScore: shortlist.reduce((sum, r) => sum + r.matchScore, 0) / shortlist.length || 0,
        scoreRange: {
          min: shortlist.length > 0 ? Math.min(...shortlist.map(r => r.matchScore)) : 0,
          max: shortlist.length > 0 ? Math.max(...shortlist.map(r => r.matchScore)) : 0
        },
        recommendationBreakdown: {
          'highly-recommended': shortlist.filter(r => r.recommendation === 'highly-recommended').length,
          'recommended': shortlist.filter(r => r.recommendation === 'recommended').length,
          'consider': shortlist.filter(r => r.recommendation === 'consider').length,
          'not-recommended': shortlist.filter(r => r.recommendation === 'not-recommended').length
        }
      };

      console.log(`[Shortlist] Generated ${shortlistType} for job ${jobId}:`, {
        totalProcessed: allResults.length,
        shortlisted: shortlist.length,
        averageScore: stats.averageScore.toFixed(1)
      });

      res.json({
        success: true,
        data: {
          shortlist,
          stats,
          metadata: {
            shortlistType,
            minScore: minScore as number,
            generatedAt: new Date().toISOString(),
            jobId
          }
        },
        message: `Generated ${shortlistType} shortlist with ${shortlist.length} candidates`
      });
    } catch (error: any) {
      console.error('[Shortlist] Error generating shortlist:', error);
      res.status(500).json({
        success: false,
        message: `Failed to generate shortlist: ${error.message}`
      });
    }
  }

  static async getScreeningResults(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      
      const results = await ScreeningResult.find({ jobId })
        .populate('applicantId')
        .sort({ rank: 1 });

      res.json({
        success: true,
        data: results,
        count: results.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getShortlists(req: Request, res: Response) {
    try {
      const { jobId } = req.query;
      
      const filter: any = {};
      if (jobId) filter.jobId = jobId;
      
      const shortlists = await Shortlist.find(filter)
        .populate('jobId')
        .populate({
          path: 'candidates',
          populate: {
            path: 'applicantId'
          }
        })
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: shortlists,
        count: shortlists.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async createShortlist(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { jobId, title, candidateIds } = req.body;
      
      // Verify job exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Verify all screening results exist
      const screeningResults = await ScreeningResult.find({
        _id: { $in: candidateIds },
        jobId: jobId
      });

      if (screeningResults.length !== candidateIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Some screening results not found or do not belong to this job'
        });
      }

      // Get total number of applicants screened for this job
      const totalApplicants = await ScreeningResult.countDocuments({ jobId });

      const shortlist = new Shortlist({
        jobId,
        title,
        candidates: candidateIds,
        totalApplicants
      });

      await shortlist.save();

      // Populate the response with full data
      await shortlist.populate('jobId');
      await shortlist.populate({
        path: 'candidates',
        populate: {
          path: 'applicantId'
        }
      });

      res.status(201).json({
        success: true,
        data: shortlist,
        message: 'Shortlist created successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getShortlistById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const shortlist = await Shortlist.findById(id)
        .populate('jobId')
        .populate({
          path: 'candidates',
          populate: {
            path: 'applicantId'
          }
        });

      if (!shortlist) {
        return res.status(404).json({
          success: false,
          message: 'Shortlist not found'
        });
      }

      res.json({
        success: true,
        data: shortlist
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateShortlist(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const shortlist = await Shortlist.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('jobId');

      if (!shortlist) {
        return res.status(404).json({
          success: false,
          message: 'Shortlist not found'
        });
      }
      
      res.json({
        success: true,
        data: shortlist,
        message: 'Shortlist updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteShortlist(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const shortlist = await Shortlist.findByIdAndDelete(id);
      
      if (!shortlist) {
        return res.status(404).json({
          success: false,
          message: 'Shortlist not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Shortlist deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static validateScreening() {
    return [
      body('jobId').isMongoId().withMessage('Valid job ID is required'),
      body('applicantIds').isArray({ min: 1 }).withMessage('At least one applicant ID is required'),
      body('applicantIds.*').isMongoId().withMessage('Each applicant ID must be valid'),
    ];
  }

  static validateShortlist() {
    return [
      body('jobId').isMongoId().withMessage('Valid job ID is required'),
      body('title').trim().notEmpty().withMessage('Shortlist title is required'),
      body('candidateIds').isArray({ min: 1 }).withMessage('At least one candidate ID is required'),
      body('candidateIds.*').isMongoId().withMessage('Each candidate ID must be valid'),
    ];
  }
}
