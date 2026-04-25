'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { fetchJobs, fetchApplicants, fetchShortlists, runScreening } from '@/store/slices';
import {
  ChartBarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  StarIcon,
  PlayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export default function ScreeningDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const { applicants } = useSelector((state: RootState) => state.applicants);
  const { shortlists, results, loading } = useSelector((state: RootState) => state.screening);

  const [selectedJob, setSelectedJob] = useState('');
  const [timeRange, setTimeRange] = useState('30d');
  const [showRunModal, setShowRunModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchApplicants());
    dispatch(fetchShortlists());
  }, [dispatch]);

  const filteredJobs = selectedJob 
    ? jobs.filter(job => job._id === selectedJob)
    : jobs.filter(job => job.status === 'active');

  const totalApplicants = applicants.length;
  const screenedApplicants = results.length;
  const shortlistedCandidates = shortlists.reduce((acc, shortlist) => acc + (shortlist.candidates?.length || 0), 0);
  const activeJobs = jobs.filter(job => job.status === 'active').length;

  // Group screening results by job to show screening sessions
  const screeningsByJob = results.reduce((acc, result) => {
    if (!acc[result.jobId]) {
      acc[result.jobId] = {
        jobId: result.jobId,
        applicants: [],
        createdAt: result.createdAt,
        averageScore: 0
      };
    }
    acc[result.jobId].applicants.push(result);
    return acc;
  }, {} as Record<string, { jobId: string; applicants: any[]; createdAt: Date; averageScore: number }>);

  // Calculate average scores and convert to array
  const recentScreenings = Object.values(screeningsByJob)
    .map(screening => ({
      ...screening,
      averageScore: screening.applicants.reduce((sum, app) => sum + app.matchScore, 0) / screening.applicants.length,
      applicantsCount: screening.applicants.length
    }))
    .sort((a, b) => new Date(typeof b.createdAt === 'string' ? b.createdAt : b.createdAt.toISOString()).getTime() - new Date(typeof a.createdAt === 'string' ? a.createdAt : a.createdAt.toISOString()).getTime())
    .slice(0, 5);
    
  const recentShortlists = shortlists.slice(0, 5);

  const handleRunScreening = async (jobId: string, retryCount = 0) => {
    const maxRetries = 3;
    const baseDelay = 5000; // 5 seconds
    
    try {
      console.log('🚀 Starting screening for job:', jobId);
      // Only get applicants who applied for this job
      const jobApplicants = applicants.filter(applicant => 
        applicant.appliedJobs && applicant.appliedJobs.includes(jobId)
      );
      
      if (jobApplicants.length === 0) {
        alert('No applicants have applied for this position yet. Please wait for candidates to apply before running screening.');
        return;
      }
      
      const applicantIds = jobApplicants.map(applicant => applicant._id);
      console.log('👥 Applicants who applied for this job:', applicantIds.length);
      
      // Show progress message
      if (retryCount === 0) {
        setSuccessMessage(`Screening in progress... Processing ${applicantIds.length} candidates with AI analysis.`);
      } else {
        setSuccessMessage(`Retrying screening... (Attempt ${retryCount + 1}/${maxRetries + 1})`);
      }
      
      const result = await dispatch(runScreening({ jobId, applicantIds })).unwrap();
      console.log('✅ Screening completed successfully:', result);
      
      setShowRunModal(false);
      
      // Refresh data to get latest screening results and shortlists
      await dispatch(fetchShortlists());
      console.log('🔄 Refreshed shortlists after screening');
      
      // Show success message
      setSuccessMessage(`Screening completed successfully! ${applicantIds.length} candidates processed.`);
      setTimeout(() => setSuccessMessage(''), 8000); // Longer display time
    } catch (error: any) {
      console.error('❌ Error running screening:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        retryCount
      });
      
      // Check if it's a rate limit error and we can retry
      if (error.response?.status === 429 && retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
        console.log(`🔄 Rate limit hit. Retrying in ${delay/1000} seconds...`);
        
        setSuccessMessage(`Rate limit hit. Retrying in ${delay/1000} seconds... (Attempt ${retryCount + 2}/${maxRetries + 1})`);
        
        // Wait for the delay and retry
        await new Promise(resolve => setTimeout(resolve, delay));
        return handleRunScreening(jobId, retryCount + 1);
      }
      
      // Show user-friendly error message
      let errorMessage = error.response?.data?.message || error.message || 'Failed to run screening. Please try again.';
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Screening timed out. The AI analysis is taking longer than expected. Please try again.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a few minutes before trying again.';
      }
      
      alert(`Error: ${errorMessage}`);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statsCards = [
    {
      title: 'Active Jobs',
      value: activeJobs,
      icon: BriefcaseIcon,
      color: 'bg-blue-500',
      change: '+2 from last month',
      trend: 'up'
    },
    {
      title: 'Total Applicants',
      value: totalApplicants,
      icon: UserGroupIcon,
      color: 'bg-green-500',
      change: '+12 from last week',
      trend: 'up'
    },
    {
      title: 'Screened Candidates',
      value: screenedApplicants,
      icon: ClipboardDocumentListIcon,
      color: 'bg-purple-500',
      change: '+8 from last week',
      trend: 'up'
    },
    {
      title: 'Shortlisted',
      value: shortlistedCandidates,
      icon: StarIcon,
      color: 'bg-yellow-500',
      change: '+3 from last week',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Screening Dashboard</h1>
          <p className="text-gray-600 mt-1">Analytics and insights for candidate screening</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={() => setShowRunModal(true)}
            className="btn btn-primary flex items-center"
          >
            <PlayIcon className="w-4 h-4 mr-2" />
            Run Screening
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Screening Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Screening Results</h2>
            <p className="text-sm text-gray-600 mt-1">
              Latest candidate evaluations from AI screening
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {results.slice(0, 5).map((result) => {
                const job = jobs.find(j => j._id === result.jobId);
                // Handle both populated and unpopulated applicant data
                let applicant = null;
                if (typeof result.applicantId === 'object') {
                  // If applicantId is populated (object)
                  applicant = result.applicantId as any;
                } else {
                  // If applicantId is just an ID string, find in applicants array
                  applicant = applicants.find(a => a._id === result.applicantId);
                }
                
                return (
                  <div key={result._id} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {applicant?.name || 'Unknown Applicant'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Applied for: {job?.title || 'Unknown Job'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          result.matchScore >= 80 ? 'text-green-600' : 
                          result.matchScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {Math.round(result.matchScore)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.recommendation?.replace('-', ' ') || 'Score'}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {result.rank} of {results.length} ranked
                      </span>
                      {result.strengths?.slice(0, 2).map((strength, idx) => (
                        <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          +{strength}
                        </span>
                      ))}
                    </div>
                    {result.reasoning && (
                      <p className="text-sm text-gray-600 italic">
                        "{result.reasoning.substring(0, 100)}..."
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {results.length > 5 && (
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all {results.length} results →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="input pl-10 w-full appearance-none"
            >
              <option value="">All Jobs</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>
                  {job.title} - {job.department}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setSelectedJob('')}
            className="btn btn-secondary"
          >
            Clear Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Screenings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Screenings</h2>
          </div>
          <div className="p-6">
            {recentScreenings.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardDocumentListIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No screenings run yet</p>
                <button
                  onClick={() => setShowRunModal(true)}
                  className="btn btn-primary mt-4"
                >
                  Run First Screening
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentScreenings.map((screening, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {jobs.find(job => job._id === screening.jobId)?.title || 'Screening'} Results
                      </h3>
                      <p className="text-sm text-gray-600">
                        {screening.applicantsCount || 0} applicants screened
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(screening.createdAt ? (typeof screening.createdAt === 'string' ? screening.createdAt : screening.createdAt.toISOString()) : new Date().toISOString())}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getMatchScoreColor(screening.averageScore || 75)}`}>
                        {Math.round(screening.averageScore || 75)}%
                      </div>
                      <p className="text-xs text-gray-600">Avg Match Score</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Shortlists */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Shortlists</h2>
          </div>
          <div className="p-6">
            {recentShortlists.length === 0 ? (
              <div className="text-center py-8">
                <StarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No shortlists created yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentShortlists.map((shortlist, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{shortlist.title}</h3>
                      <p className="text-sm text-gray-600">
                        {shortlist.candidates?.length || 0} candidates
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(shortlist.createdAt ? (typeof shortlist.createdAt === 'string' ? shortlist.createdAt : shortlist.createdAt.toISOString()) : new Date().toISOString())}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        shortlist.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {shortlist.status || 'active'}
                      </span>
                      <button
                        onClick={() => router.push(`/screening/shortlists/${shortlist._id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Performance Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Job Performance Overview</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Screened
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shortlisted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Match Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.employmentType}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{job.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {applicants.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {results.filter(r => r.jobId === job._id).length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {shortlists.filter(s => (s.jobId as any)?._id === job._id).reduce((acc, s) => acc + (s.candidates?.length || 0), 0)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-16 bg-gray-200 rounded-full h-2 mr-2`}>
                          {(() => {
                            const jobResults = results.filter(r => r.jobId === job._id);
                            const avgScore = jobResults.length > 0 
                              ? jobResults.reduce((sum, r) => sum + r.matchScore, 0) / jobResults.length 
                              : 0;
                            return (
                              <div 
                                className={`h-2 rounded-full ${
                                  avgScore >= 80 ? 'bg-green-500' : avgScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.round(avgScore)}%` }}
                              ></div>
                            );
                          })()}
                        </div>
                        {(() => {
                          const jobResults = results.filter(r => r.jobId === job._id);
                          const avgScore = jobResults.length > 0 
                            ? Math.round(jobResults.reduce((sum, r) => sum + r.matchScore, 0) / jobResults.length) 
                            : 0;
                          return (
                            <span className={`text-sm font-medium ${
                              avgScore >= 80 ? 'text-green-600' : avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {avgScore}%
                            </span>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedJob(job._id);
                            setShowRunModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Run Screening
                        </button>
                        <button
                          onClick={() => router.push(`/jobs/${job._id}`)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View Job
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Run Screening Modal */}
      {showRunModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <PlayIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Run AI Screening
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  Select a job to run AI-powered candidate screening.
                </p>
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="input w-full mb-4"
                >
                  <option value="">Choose a job...</option>
                  {jobs.filter(job => job.status === 'active').map(job => (
                    <option key={job._id} value={job._id}>
                      {job.title} - {job.department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="items-center px-4 py-3 flex justify-center space-x-4">
                <button
                  onClick={() => setShowRunModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => selectedJob && handleRunScreening(selectedJob)}
                  disabled={!selectedJob || loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : null}
                  Run Screening
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
