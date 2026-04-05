import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicant extends Document {
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: {
    years: number;
    level: 'entry' | 'mid' | 'senior' | 'executive';
  };
  skills: string[];
  education: {
    degree: string;
    field: string;
    institution: string;
    year: number;
  }[];
  workHistory: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  source: 'umurava' | 'external';
  createdAt: Date;
  updatedAt: Date;
}

const ApplicantSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  experience: {
    years: {
      type: Number,
      required: true,
      min: 0,
    },
    level: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'executive'],
      required: true,
    },
  },
  skills: [{
    type: String,
    required: true,
  }],
  education: [{
    degree: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 10,
    },
  }],
  workHistory: [{
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  }],
  resumeUrl: {
    type: String,
  },
  linkedinUrl: {
    type: String,
  },
  portfolioUrl: {
    type: String,
  },
  source: {
    type: String,
    enum: ['umurava', 'external'],
    required: true,
    default: 'external',
  },
}, {
  timestamps: true,
});

ApplicantSchema.index({ email: 1 });
ApplicantSchema.index({ skills: 1 });
ApplicantSchema.index({ 'experience.level': 1 });
ApplicantSchema.index({ source: 1 });

export const Applicant = mongoose.model<IApplicant>('Applicant', ApplicantSchema);
