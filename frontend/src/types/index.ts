export interface Job {
  _id: string;
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

export interface Applicant {
  _id: string;
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
  appliedJobs: string[];
  source: 'umurava' | 'external';
  createdAt: Date;
  updatedAt: Date;
}

export interface ScreeningResult {
  _id: string;
  jobId: string;
  applicantId: string;
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

export interface Shortlist {
  _id: string;
  jobId: string;
  title: string;
  candidates: ScreeningResult[];
  totalApplicants: number;
  status?: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'recruiter' | 'admin';
  company?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface AIRequest {
  job: Job;
  applicants: Applicant[];
  criteria: {
    skills: string[];
    experience: string;
    education: string;
  };
}
