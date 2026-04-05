import { api } from './api';
import { Job, Applicant, ScreeningResult, Shortlist } from '../types';

export const jobsApi = {
  getAllJobs: () => api.get<Job[]>('/jobs'),
  getJobById: (id: string) => api.get<Job>(`/jobs/${id}`),
  createJob: (jobData: Partial<Job>) => api.post<Job>('/jobs', jobData),
  updateJob: (id: string, jobData: Partial<Job>) => api.put<Job>(`/jobs/${id}`, jobData),
  deleteJob: (id: string) => api.delete(`/jobs/${id}`),
};

export const applicantsApi = {
  getAllApplicants: () => api.get<Applicant[]>('/applicants'),
  getApplicantById: (id: string) => api.get<Applicant>(`/applicants/${id}`),
  createApplicant: (applicantData: Partial<Applicant>) => api.post<Applicant>('/applicants', applicantData),
  updateApplicant: (id: string, applicantData: Partial<Applicant>) => api.put<Applicant>(`/applicants/${id}`, applicantData),
  deleteApplicant: (id: string) => api.delete(`/applicants/${id}`),
  uploadApplicants: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post<Applicant[]>('/applicants/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },
};

export const screeningApi = {
  runScreening: (jobId: string, applicantIds: string[]) => 
    api.post<ScreeningResult[]>('/screening/run', { jobId, applicantIds }),
  getScreeningResults: (jobId: string) => 
    api.get<ScreeningResult[]>(`/screening/results/${jobId}`),
  getShortlists: () => api.get<Shortlist[]>('/screening/shortlists'),
  getShortlistById: (id: string) => api.get<Shortlist>(`/screening/shortlists/${id}`),
  createShortlist: (jobId: string, title: string, candidateIds: string[]) =>
    api.post<Shortlist>('/screening/shortlists', { jobId, title, candidateIds }),
  updateShortlist: (id: string, data: Partial<Shortlist>) =>
    api.put<Shortlist>(`/screening/shortlists/${id}`, data),
  deleteShortlist: (id: string) => api.delete(`/screening/shortlists/${id}`),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: any }>('/auth/login', { email, password }),
  register: (userData: any) =>
    api.post<{ token: string; user: any }>('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};
