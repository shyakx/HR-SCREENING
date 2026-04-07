import { Request, Response } from 'express';
import { Applicant } from '../models';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import csv from 'csv-parser';
import xlsx from 'xlsx';
import { Readable } from 'stream';
import { ResumeParser } from '../services/resumeParser';

const upload = multer({ storage: multer.memoryStorage() });

export class ApplicantController {
  static async getAllApplicants(req: Request, res: Response) {
    try {
      const { source, skills, experienceLevel } = req.query;
      
      const filter: any = {};
      if (source) filter.source = source;
      if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : [skills];
        filter.skills = { $in: skillsArray };
      }
      if (experienceLevel) filter['experience.level'] = experienceLevel;
      
      const applicants = await Applicant.find(filter).sort({ createdAt: -1 });
      
      res.json({
        success: true,
        data: applicants,
        count: applicants.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getApplicantById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const applicant = await Applicant.findById(id);
      
      if (!applicant) {
        return res.status(404).json({
          success: false,
          message: 'Applicant not found'
        });
      }
      
      res.json({
        success: true,
        data: applicant
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async createApplicant(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const applicantData = req.body;
      const applicant = new Applicant(applicantData);
      
      await applicant.save();
      
      res.status(201).json({
        success: true,
        data: applicant,
        message: 'Applicant created successfully'
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Applicant with this email already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateApplicant(req: Request, res: Response) {
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
      
      const applicant = await Applicant.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!applicant) {
        return res.status(404).json({
          success: false,
          message: 'Applicant not found'
        });
      }
      
      res.json({
        success: true,
        data: applicant,
        message: 'Applicant updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteApplicant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const applicant = await Applicant.findByIdAndDelete(id);
      
      if (!applicant) {
        return res.status(404).json({
          success: false,
          message: 'Applicant not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Applicant deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async uploadResumePDF(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No PDF file uploaded'
        });
      }

      if (!req.file.mimetype.includes('pdf')) {
        return res.status(400).json({
          success: false,
          message: 'Only PDF files are allowed for resume upload'
        });
      }

      console.log('[ResumeParser] Parsing PDF resume...');
      const parsedData = await ResumeParser.parsePDFResume(req.file.buffer);
      
      // Ensure required fields have defaults
      const applicantData = {
        name: parsedData.name || 'Unknown Name',
        email: parsedData.email || 'unknown@example.com',
        phone: parsedData.phone || 'Not provided',
        location: parsedData.location || 'Not provided',
        experience: parsedData.experience || { years: 0, level: 'entry' },
        skills: parsedData.skills || [],
        education: parsedData.education || [],
        workHistory: parsedData.workHistory || [],
        source: 'external' as const
      };

      console.log('[ResumeParser] Parsed data:', {
        name: applicantData.name,
        email: applicantData.email,
        skillsCount: applicantData.skills.length,
        experienceYears: applicantData.experience.years
      });

      // Check if applicant already exists
      const existingApplicant = await Applicant.findOne({ email: applicantData.email });
      if (existingApplicant) {
        return res.status(409).json({
          success: false,
          message: 'Applicant with this email already exists',
          data: existingApplicant
        });
      }

      // Create new applicant
      const applicant = new Applicant(applicantData);
      await applicant.save();

      console.log('[ResumeParser] Successfully created applicant:', applicant._id);

      res.status(201).json({
        success: true,
        data: applicant,
        message: 'Resume uploaded and parsed successfully',
        parsedFields: {
          name: !!parsedData.name,
          email: !!parsedData.email,
          phone: !!parsedData.phone,
          skills: parsedData.skills?.length || 0,
          education: parsedData.education?.length || 0,
          workHistory: parsedData.workHistory?.length || 0
        }
      });
    } catch (error: any) {
      console.error('[ResumeParser] Error processing PDF:', error);
      res.status(500).json({
        success: false,
        message: `Failed to process resume: ${error.message}`
      });
    }
  }

  static async uploadApplicants(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const file = req.file;
      let applicants: any[] = [];

      if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        // Process CSV file
        const buffer = file.buffer;
        const readableStream = Readable.from(buffer.toString());
        
        applicants = await new Promise((resolve, reject) => {
          const results: any[] = [];
          readableStream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
        });
      } else if (file.mimetype.includes('sheet') || file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls')) {
        // Process Excel file
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        applicants = xlsx.utils.sheet_to_json(worksheet);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Unsupported file format. Please upload CSV or Excel files.'
        });
      }

      // Transform and validate applicant data
      const transformedApplicants = applicants.map((row: any) => {
        return {
          name: row.Name || row.name || '',
          email: row.Email || row.email || '',
          phone: row.Phone || row.phone || '',
          location: row.Location || row.location || '',
          experience: {
            years: parseInt(row['Experience Years'] || row.experienceYears || '0'),
            level: row['Experience Level'] || row.experienceLevel || 'entry'
          },
          skills: (row.Skills || row.skills || '').split(',').map((skill: string) => skill.trim()).filter(Boolean),
          education: [{
            degree: row.Degree || row.degree || '',
            field: row.Field || row.field || '',
            institution: row.Institution || row.institution || '',
            year: parseInt(row['Graduation Year'] || row.graduationYear || '2020')
          }],
          workHistory: [{
            company: row.Company || row.company || '',
            position: row.Position || row.position || '',
            duration: row.Duration || row.duration || '',
            description: row['Work Description'] || row.workDescription || ''
          }],
          source: 'external'
        };
      }).filter(applicant => applicant.name && applicant.email);

      // Save applicants to database
      const savedApplicants = await Applicant.insertMany(transformedApplicants, { 
        ordered: false // Continue even if some documents fail
      }).catch(error => {
        if (error.code === 11000) {
          // Handle duplicate key errors
          const duplicates = error.result?.writeErrors?.length || 0;
          console.log(`${duplicates} duplicate applicants skipped`);
          return error.result?.insertedDocs || [];
        }
        throw error;
      });

      res.status(201).json({
        success: true,
        data: savedApplicants,
        message: `Successfully uploaded ${savedApplicants.length} applicants`,
        totalProcessed: transformedApplicants.length,
        duplicatesSkipped: transformedApplicants.length - savedApplicants.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async createPublicApplication(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const applicationData = req.body;
      
      // Set source to 'external' for public applications
      applicationData.source = 'external';
      
      const applicant = new Applicant(applicationData);
      
      await applicant.save();
      
      // TODO: Send confirmation email to applicant
      // TODO: Send notification email to HR team
      
      res.status(201).json({
        success: true,
        data: applicant,
        message: 'Application submitted successfully! We will contact you soon.'
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'An application with this email already exists. Please contact us if you need to update your information.'
        });
      }
      
      res.status(500).json({
        success: false,
        message: `Failed to submit application: ${error.message}`
      });
    }
  }

  static validateApplicant() {
    return [
      body('name').trim().notEmpty().withMessage('Applicant name is required'),
      body('email').isEmail().withMessage('Valid email is required'),
      body('phone').trim().notEmpty().withMessage('Phone number is required'),
      body('location').trim().notEmpty().withMessage('Location is required'),
      body('experience.years').isNumeric().withMessage('Experience years must be numeric'),
      body('experience.level').isIn(['entry', 'mid', 'senior', 'executive']).withMessage('Invalid experience level'),
      body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
      body('education').isArray({ min: 1 }).withMessage('At least one education entry is required'),
      body('education.*.degree').notEmpty().withMessage('Degree is required'),
      body('education.*.field').notEmpty().withMessage('Field of study is required'),
      body('education.*.institution').notEmpty().withMessage('Institution is required'),
      body('education.*.year').isNumeric().withMessage('Graduation year must be numeric'),
    ];
  }

  static validatePublicApplication() {
    return [
      body('name').trim().notEmpty().withMessage('Full name is required'),
      body('email').isEmail().withMessage('Valid email is required'),
      body('phone').trim().notEmpty().withMessage('Phone number is required'),
      body('location').trim().notEmpty().withMessage('Location is required'),
      body('experienceYears').isNumeric().withMessage('Experience years must be numeric'),
      body('experienceLevel').isIn(['entry', 'mid', 'senior', 'executive']).withMessage('Invalid experience level'),
      body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
      body('education').isArray({ min: 1 }).withMessage('Education information is required'),
      body('education.*.degree').notEmpty().withMessage('Degree is required'),
      body('education.*.field').notEmpty().withMessage('Field of study is required'),
      body('education.*.institution').notEmpty().withMessage('Institution is required'),
      body('education.*.year').isNumeric().withMessage('Graduation year must be numeric'),
      body('workHistory').isArray({ min: 1 }).withMessage('Work history is required'),
      body('workHistory.*.company').notEmpty().withMessage('Company is required'),
      body('workHistory.*.position').notEmpty().withMessage('Position is required'),
      body('workHistory.*.duration').notEmpty().withMessage('Duration is required'),
      body('workHistory.*.description').notEmpty().withMessage('Job description is required'),
    ];
  }
}

export const uploadMiddleware = upload.single('file');
