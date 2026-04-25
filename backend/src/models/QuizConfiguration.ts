import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizConfiguration extends Document {
  jobId: mongoose.Types.ObjectId;
  roleCategory: 'technology' | 'sales' | 'customer-service' | 'finance' | 'marketing' | 'operations' | 'management' | 'general';
  isActive: boolean;
  settings: {
    foundationalTier: {
      questionCount: number;
      passingScore: number; // Percentage needed to pass to intermediate tier
      timeLimit: number; // Total time in seconds
      randomizeQuestions: boolean;
      preventRetake: boolean;
    };
    intermediateTier: {
      questionCount: number;
      passingScore: number; // Percentage needed to pass overall
      timeLimit: number; // Total time in seconds
      randomizeQuestions: boolean;
    };
    scoring: {
      weights: {
        correctAnswer: number;
        partialCredit: number;
        timeBonus: number;
      };
      penalties: {
        wrongAnswer: number;
        timeout: number;
      };
    };
    security: {
      detectSuspiciousPatterns: boolean;
      flagCopyPaste: boolean;
      trackResponseTime: boolean;
      preventTabSwitch: boolean;
    };
  };
  questionFilters: {
    difficulty: string[];
    questionTypes: string[];
    skills: string[];
    localContextOnly: boolean;
    languagePreference: string[];
  };
  customInstructions: string;
  welcomeMessage: string;
  completionMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuizConfigurationSchema: Schema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    unique: true,
  },
  roleCategory: {
    type: String,
    enum: ['technology', 'sales', 'customer-service', 'finance', 'marketing', 'operations', 'management', 'general'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  settings: {
    foundationalTier: {
      questionCount: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 3,
      },
      passingScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 60,
      },
      timeLimit: {
        type: Number,
        required: true,
        min: 60,
        max: 1800, // 30 minutes max
        default: 600, // 10 minutes
      },
      randomizeQuestions: {
        type: Boolean,
        default: true,
      },
      preventRetake: {
        type: Boolean,
        default: true,
      },
    },
    intermediateTier: {
      questionCount: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 3,
      },
      passingScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 70,
      },
      timeLimit: {
        type: Number,
        required: true,
        min: 60,
        max: 1800,
        default: 900, // 15 minutes
      },
      randomizeQuestions: {
        type: Boolean,
        default: true,
      },
    },
    scoring: {
      weights: {
        correctAnswer: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
          default: 10,
        },
        partialCredit: {
          type: Number,
          required: true,
          min: 0,
          max: 10,
          default: 3,
        },
        timeBonus: {
          type: Number,
          required: true,
          min: 0,
          max: 5,
          default: 2,
        },
      },
      penalties: {
        wrongAnswer: {
          type: Number,
          required: true,
          min: 0,
          max: 10,
          default: 0,
        },
        timeout: {
          type: Number,
          required: true,
          min: 0,
          max: 10,
          default: 0,
        },
      },
    },
    security: {
      detectSuspiciousPatterns: {
        type: Boolean,
        default: true,
      },
      flagCopyPaste: {
        type: Boolean,
        default: true,
      },
      trackResponseTime: {
        type: Boolean,
        default: true,
      },
      preventTabSwitch: {
        type: Boolean,
        default: false, // Might be too strict for mobile
      },
    },
  },
  questionFilters: {
    difficulty: [{
      type: String,
      enum: ['foundational', 'intermediate', 'advanced'],
    }],
    questionTypes: [{
      type: String,
      enum: ['scenario', 'multiple-choice', 'short-answer', 'practical'],
    }],
    skills: [{
      type: String,
    }],
    localContextOnly: {
      type: Boolean,
      default: false,
    },
    languagePreference: [{
      type: String,
      enum: ['english', 'french', 'kinyarwanda', 'mixed'],
    }],
  },
  customInstructions: {
    type: String,
    trim: true,
  },
  welcomeMessage: {
    type: String,
    required: true,
    default: 'Welcome to the Role Fit Check. This assessment helps us understand your skills and experience for this position.',
  },
  completionMessage: {
    type: String,
    required: true,
    default: 'Thank you for completing the assessment. We will review your responses and be in touch soon.',
  },
}, {
  timestamps: true,
});

// Indexes for efficient querying
QuizConfigurationSchema.index({ jobId: 1 });
QuizConfigurationSchema.index({ roleCategory: 1 });
QuizConfigurationSchema.index({ isActive: 1 });

export const QuizConfiguration = mongoose.model<IQuizConfiguration>('QuizConfiguration', QuizConfigurationSchema);
