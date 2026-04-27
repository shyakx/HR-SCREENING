import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizAttempt extends Document {
  jobId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  quizSessionId: string;
  status: 'in-progress' | 'completed' | 'expired' | 'abandoned';
  tier: 'foundational' | 'intermediate';
  questions: Array<{
    questionId: mongoose.Types.ObjectId;
    questionText: string;
    questionType: string;
    options?: string[];
    explanation?: string;
    skills?: string[];
    userAnswer: string | number | string[];
    correctAnswer: string | number;
    isCorrect: boolean;
    points: number;
    pointsEarned: number;
    timeTaken: number;
    timeLimit?: number;
    startedAt: Date;
    submittedAt: Date;
  }>;
  scores: {
    foundational: {
      totalQuestions: number;
      correctAnswers: number;
      totalPoints: number;
      pointsEarned: number;
      percentage: number;
    };
    intermediate?: {
      totalQuestions: number;
      correctAnswers: number;
      totalPoints: number;
      pointsEarned: number;
      percentage: number;
    };
    overall: {
      totalQuestions: number;
      correctAnswers: number;
      totalPoints: number;
      pointsEarned: number;
      percentage: number;
    };
  };
  analytics: {
    totalTime: number;
    averageTimePerQuestion: number;
    suspiciousPatterns: Array<{
      type: 'too-fast' | 'too-slow' | 'copy-paste' | 'generic-response';
      questionIndex: number;
      confidence: number;
      details: string;
    }>;
    authenticityScore: number;
    languagePatterns: {
      primaryLanguage: string;
      codeSwitching: boolean;
      formality: 'formal' | 'informal' | 'mixed';
    };
  };
  progression: {
    startedAt: Date;
    completedAt?: Date;
    lastActivityAt: Date;
    timeToComplete: number;
    abandonedAt?: Date;
    abandonReason?: 'timeout' | 'manual' | 'technical';
  };
  crossReference: {
    cvClaims: Array<{
      skill: string;
      claimedLevel: string;
      quizEvidence: string;
      consistency: 'consistent' | 'inconsistent' | 'exceeds-claims' | 'below-claims';
      confidence: number;
    }>;
    redFlags: Array<{
      type: 'experience-inflation' | 'skill-misrepresentation' | 'credential-exaggeration';
      description: string;
      severity: 'low' | 'medium' | 'high';
    }>;
    hiddenGems: Array<{
      type: 'underselling' | 'hidden-talent' | 'unexpected-strength';
      description: string;
      potential: string;
    }>;
  };
  recommendation: {
    passToNextTier: boolean;
    overallScore: number;
    fitLevel: 'high' | 'medium' | 'low';
    interviewReadiness: 'ready' | 'needs-preparation' | 'not-ready';
    keyStrengths: string[];
    areasToProbe: string[];
    suggestedInterviewQuestions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  updateAnalytics(): void;
  addSuspiciousPattern(pattern: any): void;
  calculateAuthenticityScore(): void;
}

const QuizAttemptSchema: Schema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: 'Applicant',
    required: true,
  },
  quizSessionId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'expired', 'abandoned'],
    default: 'in-progress',
  },
  tier: {
    type: String,
    enum: ['foundational', 'intermediate'],
    required: true,
  },
  questions: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'QuizQuestion',
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      required: true,
    },
    options: [String],
    explanation: String,
    skills: [String],
    userAnswer: {
      type: Schema.Types.Mixed,
      required: true,
    },
    correctAnswer: {
      type: Schema.Types.Mixed,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    pointsEarned: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number,
      required: true,
    },
    timeLimit: Number,
    startedAt: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
      required: true,
    },
  }],
  scores: {
    foundational: {
      totalQuestions: {
        type: Number,
        required: true,
      },
      correctAnswers: {
        type: Number,
        required: true,
      },
      totalPoints: {
        type: Number,
        required: true,
      },
      pointsEarned: {
        type: Number,
        required: true,
      },
      percentage: {
        type: Number,
        required: true,
      },
    },
    intermediate: {
      totalQuestions: {
        type: Number,
      },
      correctAnswers: {
        type: Number,
      },
      totalPoints: {
        type: Number,
      },
      pointsEarned: {
        type: Number,
      },
      percentage: {
        type: Number,
      },
    },
    overall: {
      totalQuestions: {
        type: Number,
        required: true,
      },
      correctAnswers: {
        type: Number,
        required: true,
      },
      totalPoints: {
        type: Number,
        required: true,
      },
      pointsEarned: {
        type: Number,
        required: true,
      },
      percentage: {
        type: Number,
        required: true,
      },
    },
  },
  analytics: {
    totalTime: {
      type: Number,
      default: 0,
    },
    averageTimePerQuestion: {
      type: Number,
      default: 0,
    },
    suspiciousPatterns: [{
      type: {
        type: String,
        enum: ['too-fast', 'too-slow', 'copy-paste', 'generic-response'],
        required: true,
      },
      questionIndex: {
        type: Number,
        required: true,
      },
      confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
      },
      details: {
        type: String,
        required: true,
      },
    }],
    authenticityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    languagePatterns: {
      primaryLanguage: {
        type: String,
        default: 'english',
      },
      codeSwitching: {
        type: Boolean,
        default: false,
      },
      formality: {
        type: String,
        enum: ['formal', 'informal', 'mixed'],
        default: 'mixed',
      },
    },
  },
  progression: {
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completedAt: Date,
    lastActivityAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    timeToComplete: {
      type: Number,
      default: 0,
    },
    abandonedAt: Date,
    abandonReason: {
      type: String,
      enum: ['timeout', 'manual', 'technical'],
    },
  },
  crossReference: {
    cvClaims: [{
      skill: {
        type: String,
        required: true,
      },
      claimedLevel: {
        type: String,
        required: true,
      },
      quizEvidence: {
        type: String,
        required: true,
      },
      consistency: {
        type: String,
        enum: ['consistent', 'inconsistent', 'exceeds-claims', 'below-claims'],
        required: true,
      },
      confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
      },
    }],
    redFlags: [{
      type: {
        type: String,
        enum: ['experience-inflation', 'skill-misrepresentation', 'credential-exaggeration'],
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true,
      },
    }],
    hiddenGems: [{
      type: {
        type: String,
        enum: ['underselling', 'hidden-talent', 'unexpected-strength'],
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      potential: {
        type: String,
        required: true,
      },
    }],
  },
  recommendation: {
    passToNextTier: {
      type: Boolean,
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    fitLevel: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true,
    },
    interviewReadiness: {
      type: String,
      enum: ['ready', 'needs-preparation', 'not-ready'],
      required: true,
    },
    keyStrengths: [String],
    areasToProbe: [String],
    suggestedInterviewQuestions: [String],
  },
}, {
  timestamps: true,
});

// Indexes for efficient querying
QuizAttemptSchema.index({ jobId: 1, status: 1 });
QuizAttemptSchema.index({ applicantId: 1 });
// quizSessionId index is already created by unique: true
QuizAttemptSchema.index({ 'recommendation.fitLevel': 1 });
QuizAttemptSchema.index({ 'analytics.authenticityScore': -1 });
QuizAttemptSchema.index({ 'progression.startedAt': -1 });

// Instance methods
QuizAttemptSchema.methods.updateAnalytics = function() {
  const totalTime = this.questions.reduce((sum: number, q: any) => sum + q.timeTaken, 0);
  const averageTimePerQuestion = totalTime / this.questions.length;

  this.analytics.totalTime = totalTime;
  this.analytics.averageTimePerQuestion = averageTimePerQuestion;
};

QuizAttemptSchema.methods.addSuspiciousPattern = function(pattern: any) {
  this.analytics.suspiciousPatterns.push(pattern);
};

QuizAttemptSchema.methods.calculateAuthenticityScore = function() {
  let authenticityScore = 50; // Base score

  // Penalize suspicious patterns
  this.analytics.suspiciousPatterns.forEach((pattern: any) => {
    authenticityScore -= pattern.confidence * 20;
  });

  // Bonus for varied response times
  const times = this.questions.map((q: any) => q.timeTaken);
  const mean = times.reduce((sum: number, time: number) => sum + time, 0) / times.length;
  const squaredDiffs = times.map((time: number) => Math.pow(time - mean, 2));
  const variance = squaredDiffs.reduce((sum: number, diff: number) => sum + diff, 0) / times.length;
  const normalizedVariance = variance / (mean * mean);

  if (normalizedVariance > 0.3) {
    authenticityScore += 10;
  }

  this.analytics.authenticityScore = Math.max(0, Math.min(100, authenticityScore));
};

export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
