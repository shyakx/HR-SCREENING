import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizQuestion extends Document {
  roleCategory: 'technology' | 'sales' | 'customer-service' | 'finance' | 'marketing' | 'operations' | 'management' | 'general';
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  questionType: 'scenario' | 'multiple-choice' | 'short-answer' | 'practical';
  question: string;
  scenario?: string; // For scenario-based questions
  options?: string[]; // For multiple-choice questions
  correctAnswer: string | number; // Can be text for open-ended, index for multiple-choice
  explanation: string; // Why this answer is correct
  skills: string[]; // Skills this question tests
  timeLimit: number; // Time limit in seconds
  points: number; // Points awarded for correct answer
  isActive: boolean;
  metadata: {
    localContext: boolean; // Whether question uses Rwandan/East African context
    institutionRelevant: string[]; // Institutions this question is relevant for (UR, REB, etc.)
    language: 'english' | 'french' | 'kinyarwanda' | 'mixed';
  };
  usage: {
    timesUsed: number;
    averageScore: number;
    lastUsed: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema: Schema = new Schema({
  roleCategory: {
    type: String,
    enum: ['technology', 'sales', 'customer-service', 'finance', 'marketing', 'operations', 'management', 'general'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['foundational', 'intermediate', 'advanced'],
    required: true,
  },
  questionType: {
    type: String,
    enum: ['scenario', 'multiple-choice', 'short-answer', 'practical'],
    required: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  scenario: {
    type: String,
    trim: true,
  },
  options: [{
    type: String,
    trim: true,
  }],
  correctAnswer: {
    type: Schema.Types.Mixed, // Can be string or number
    required: true,
  },
  explanation: {
    type: String,
    required: true,
    trim: true,
  },
  skills: [{
    type: String,
    required: true,
    trim: true,
  }],
  timeLimit: {
    type: Number,
    required: true,
    min: 30, // Minimum 30 seconds
    max: 600, // Maximum 10 minutes
    default: 120, // Default 2 minutes
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
    default: 10,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  metadata: {
    localContext: {
      type: Boolean,
      default: false,
    },
    institutionRelevant: [{
      type: String,
      enum: ['UR', 'INES', 'AUCA', 'CMU-Africa', 'REB', 'TVET', 'Private', 'International'],
    }],
    language: {
      type: String,
      enum: ['english', 'french', 'kinyarwanda', 'mixed'],
      default: 'english',
    },
  },
  usage: {
    timesUsed: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    lastUsed: {
      type: Date,
    },
  },
}, {
  timestamps: true,
});

// Indexes for efficient querying
QuizQuestionSchema.index({ roleCategory: 1, difficulty: 1, isActive: 1 });
QuizQuestionSchema.index({ skills: 1 });
QuizQuestionSchema.index({ 'metadata.institutionRelevant': 1 });
QuizQuestionSchema.index({ 'usage.timesUsed': -1 });
QuizQuestionSchema.index({ questionType: 1 });

export const QuizQuestion = mongoose.model<IQuizQuestion>('QuizQuestion', QuizQuestionSchema);
