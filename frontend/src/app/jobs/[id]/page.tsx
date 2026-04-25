'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Job } from '@/types';
import Link from 'next/link';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/jobs/${jobId}`);
        const result = await response.json();
        
        if (result.success && result.data.status === 'active') {
          setJob(result.data);
        } else {
          router.push('/jobs/public');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        router.push('/jobs/public');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, router]);

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

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">This job may no longer be available.</p>
          <Link href="/jobs/public" className="btn btn-primary">
            View All Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/jobs/public" className="text-blue-100 hover:text-white text-sm mb-2 inline-block">
                ← Back to Jobs
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{job.title}</h1>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
              <p className="text-blue-100">{job.department} · {job.location} · {job.employmentType}</p>
            </div>
            <Link href={`/jobs/${job._id}/apply`} className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Apply Now
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-600 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-600 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>

            {/* Required Skills */}
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-600 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Job Details Card */}
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-600 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Department</div>
                  <div className="font-medium text-gray-900">{job.department}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium text-gray-900">{job.location}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Employment Type</div>
                  <div className="font-medium text-gray-900">{job.employmentType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Experience Level</div>
                  <div className="font-medium text-gray-900">{job.experienceLevel}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Posted Date</div>
                  <div className="font-medium text-gray-900">
                    {new Date(typeof job.createdAt === 'string' ? job.createdAt : job.createdAt.toISOString()).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Apply?</h3>
              <p className="text-gray-600 mb-6">
                Join our team and help us build amazing products. We're looking for talented individuals who are passionate about making an impact.
              </p>
              <Link href={`/jobs/${job._id}/apply`} className="w-full block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-3">
                Apply for This Position
              </Link>
              <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Share Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
