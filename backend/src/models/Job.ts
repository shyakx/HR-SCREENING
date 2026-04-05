import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  department: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'active' | 'inactive' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [{
    type: String,
    required: true,
  }],
  skills: [{
    type: String,
    required: true,
  }],
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    required: true,
  },
  salaryRange: {
    min: {
      type: Number,
      min: 0,
    },
    max: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
  },
  location: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'closed'],
    default: 'active',
  },
}, {
  timestamps: true,
});

export const Job = mongoose.model<IJob>('Job', JobSchema);
