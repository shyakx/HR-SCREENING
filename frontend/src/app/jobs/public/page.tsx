'use client';

import React, { useEffect, useState } from 'react';
import { Job } from '@/types';
import Link from 'next/link';

export default function PublicJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: '',
    location: '',
    experienceLevel: '',
    employmentType: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/jobs`);
        const result = await response.json();
        
        if (result.success) {
          // Only show active jobs to the public
          setJobs(result.data.filter((job: Job) => job.status === 'active'));
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    return (
      (!filters.department || job.department.toLowerCase().includes(filters.department.toLowerCase())) &&
      (!filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.experienceLevel || job.experienceLevel === filters.experienceLevel) &&
      (!filters.employmentType || job.employmentType === filters.employmentType)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white font-bold uppercase';
      default: return 'bg-gray-500 text-white font-bold uppercase';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Career Opportunities</h1>
            <p className="text-xl text-blue-100 mb-8">Join our team and make an impact</p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-blue-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{jobs.length}</div>
                <div className="text-sm text-blue-100">Open Positions</div>
              </div>
              <div className="bg-blue-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{jobs.filter(j => j.experienceLevel === 'entry').length}</div>
                <div className="text-sm text-blue-100">Entry Level</div>
              </div>
              <div className="bg-blue-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{jobs.filter(j => j.employmentType === 'full-time').length}</div>
                <div className="text-sm text-blue-100">Full Time</div>
              </div>
              <div className="bg-blue-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{Array.from(new Set(jobs.map(j => j.department))).length}</div>
                <div className="text-sm text-blue-100">Departments</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-600 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Departments</option>
                {Array.from(new Set(jobs.map(j => j.department))).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Locations</option>
                {Array.from(new Set(jobs.map(j => j.location))).map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <select
                value={filters.experienceLevel}
                onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <select
                value={filters.employmentType}
                onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>
          {(filters.department || filters.location || filters.experienceLevel || filters.employmentType) && (
            <button
              onClick={() => setFilters({ department: '', location: '', experienceLevel: '', employmentType: '' })}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-600 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {jobs.length === 0 ? 'No Open Positions' : 'No Jobs Match Your Filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {jobs.length === 0 
                  ? 'We don\'t have any open positions right now, but check back soon!'
                  : 'Try adjusting your filters to see more opportunities.'
                }
              </p>
              {jobs.length > 0 && (
                <button
                  onClick={() => setFilters({ department: '', location: '', experienceLevel: '', employmentType: '' })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-sm border-l-4 border-blue-600 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-semibold text-gray-900">{job.title}</h2>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                          {job.department}
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                          {job.experienceLevel}
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                          {job.employmentType}
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                          {job.location}
                        </span>
                      </div>
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-800 mb-2">Key Requirements:</h3>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {job.requirements.slice(0, 3).map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                          {job.requirements.length > 3 && (
                            <li className="text-blue-600">+{job.requirements.length - 3} more requirements</li>
                          )}
                        </ul>
                      </div>
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-800 mb-2">Required Skills:</h3>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Posted {new Date(typeof job.createdAt === 'string' ? job.createdAt : job.createdAt.toISOString()).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{job.requirements.length}</span> requirements · 
                      <span className="font-medium ml-1">{job.skills.length}</span> skills required
                    </div>
                    <div className="flex gap-3">
                      <Link 
                        href={`/jobs/${job._id}`}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        View Details
                      </Link>
                      <Link 
                        href={`/jobs/${job._id}/apply`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-blue-600 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Can't find what you're looking for?</h3>
            <p className="text-blue-100 mb-4">
              We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <button className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
              Send Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
