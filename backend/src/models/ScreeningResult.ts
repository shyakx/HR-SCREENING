import mongoose, { Schema, Document } from 'mongoose';

export interface IScreeningResult extends Document {
  jobId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  matchScore: number;
  rank: number;
  strengths: string[];
  gaps: string[];
  recommendation: 'highly-recommended' | 'recommended' | 'consider' | 'not-recommended';
  reasoning: string;
  skillAlignment: {
    [key: string]: {
      required: boolean;
      present: boolean;
      score: number;
    };
  };
  createdAt: Date;
}

const ScreeningResultSchema: Schema = new Schema({
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
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  rank: {
    type: Number,
    required: true,
    min: 1,
  },
  strengths: [{
    type: String,
    required: true,
  }],
  gaps: [{
    type: String,
    required: true,
  }],
  recommendation: {
    type: String,
    enum: ['highly-recommended', 'recommended', 'consider', 'not-recommended'],
    required: true,
  },
  reasoning: {
    type: String,
    required: true,
  },
  skillAlignment: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

ScreeningResultSchema.index({ jobId: 1, rank: 1 });
ScreeningResultSchema.index({ applicantId: 1 });
ScreeningResultSchema.index({ matchScore: -1 });

export const ScreeningResult = mongoose.model<IScreeningResult>('ScreeningResult', ScreeningResultSchema);
