'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { createJob, updateJob, fetchJobById } from '@/store/slices/jobsSlice';
import { 
  BriefcaseIcon, 
  XMarkIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface JobFormProps {
  jobId?: string;
  onClose?: () => void;
}

export default function JobForm({ jobId, onClose }: JobFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentJob, loading } = useSelector((state: RootState) => state.jobs);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [''],
    skills: [''],
    experienceLevel: 'entry' as 'entry' | 'mid' | 'senior' | 'executive',
    location: '',
    department: '',
    employmentType: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'internship',
    salaryRange: {
      min: '',
      max: '',
      currency: 'USD'
    },
    status: 'active' as 'active' | 'inactive' | 'closed'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId));
    }
  }, [dispatch, jobId]);

  useEffect(() => {
    if (jobId && currentJob) {
      setFormData({
        title: currentJob.title || '',
        description: currentJob.description || '',
        requirements: currentJob.requirements || [''],
        skills: currentJob.skills || [''],
        experienceLevel: currentJob.experienceLevel || 'entry',
        location: currentJob.location || '',
        department: currentJob.department || '',
        employmentType: currentJob.employmentType || 'full-time',
        salaryRange: {
          min: currentJob.salaryRange?.min?.toString() || '',
          max: currentJob.salaryRange?.max?.toString() || '',
          currency: currentJob.salaryRange?.currency || 'USD'
        },
        status: currentJob.status || 'active'
      });
    }
  }, [jobId, currentJob]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addArrayItem = (field: 'requirements' | 'skills') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'requirements' | 'skills', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: 'requirements' | 'skills', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    
    const validRequirements = formData.requirements.filter(req => req.trim());
    if (validRequirements.length === 0) newErrors.requirements = 'At least one requirement is required';
    
    const validSkills = formData.skills.filter(skill => skill.trim());
    if (validSkills.length === 0) newErrors.skills = 'At least one skill is required';

    if (formData.salaryRange.min && formData.salaryRange.max) {
      const min = parseFloat(formData.salaryRange.min);
      const max = parseFloat(formData.salaryRange.max);
      if (min >= max) {
        newErrors.salaryRange = 'Minimum salary must be less than maximum salary';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim()),
        skills: formData.skills.filter(skill => skill.trim()),
        salaryRange: {
          ...formData.salaryRange,
          min: formData.salaryRange.min ? parseFloat(formData.salaryRange.min) : 0,
          max: formData.salaryRange.max ? parseFloat(formData.salaryRange.max) : 0
        }
      };

      if (jobId) {
        await dispatch(updateJob({ id: jobId, jobData })).unwrap();
      } else {
        await dispatch(createJob(jobData)).unwrap();
      }

      if (onClose) {
        onClose();
      } else {
        router.push('/jobs');
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  if (loading && jobId) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {jobId ? 'Edit Job' : 'Create New Job'}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
              placeholder="e.g. Senior Software Engineer"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className={`input w-full ${errors.department ? 'border-red-500' : ''}`}
              placeholder="e.g. Engineering"
            />
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`input w-full ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Provide a detailed description of the role..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleInputChange}
              className="input w-full"
            >
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleInputChange}
              className="input w-full"
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`input w-full ${errors.location ? 'border-red-500' : ''}`}
              placeholder="e.g. New York, NY or Remote"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Requirements *
          </label>
          <div className="space-y-2">
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                  className="input flex-1"
                  placeholder="e.g. 5+ years of experience in software development"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addArrayItem('requirements')}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Requirement
          </button>
          {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills *
          </label>
          <div className="space-y-2">
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateArrayItem('skills', index, e.target.value)}
                  className="input flex-1"
                  placeholder="e.g. JavaScript, React, Node.js"
                />
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('skills', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addArrayItem('skills')}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Skill
          </button>
          {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Range (Optional)
          </label>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="salaryRange.min"
              value={formData.salaryRange.min}
              onChange={handleInputChange}
              className="input"
              placeholder="Min"
            />
            <input
              type="number"
              name="salaryRange.max"
              value={formData.salaryRange.max}
              onChange={handleInputChange}
              className="input"
              placeholder="Max"
            />
            <select
              name="salaryRange.currency"
              value={formData.salaryRange.currency}
              onChange={handleInputChange}
              className="input"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          {errors.salaryRange && <p className="text-red-500 text-sm mt-1">{errors.salaryRange}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="input w-full"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            {jobId ? 'Update Job' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
