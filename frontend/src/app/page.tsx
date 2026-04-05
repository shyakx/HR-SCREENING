'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '@/store/slices/jobsSlice';
import { fetchApplicants } from '@/store/slices/applicantsSlice';
import { fetchShortlists } from '@/store/slices/screeningSlice';
import { RootState, AppDispatch } from '@/store';
import { AppLayout } from '@/components/layout/AppLayout';
import { BriefcaseIcon, UserGroupIcon, ClipboardDocumentListIcon, StarIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading: jobsLoading } = useSelector((state: RootState) => state.jobs);
  const { applicants, loading: applicantsLoading } = useSelector((state: RootState) => state.applicants);
  const { shortlists, results, loading: screeningLoading } = useSelector((state: RootState) => state.screening);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchApplicants());
    dispatch(fetchShortlists());
  }, [dispatch]);

  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalApplicants = applicants.length;
  const screeningsRun = results.length > 0 ? Math.floor(results.length / 2) : 0;
  const pendingReview = applicants.filter(a => !shortlists.some(s => 
    s.candidates?.some((c: any) => (c.applicantId as any)?._id === a._id)
  )).length;

  const recentJobs = [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
  const recentShortlists = [...shortlists].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  const loading = jobsLoading || applicantsLoading || screeningLoading;

  const stats = [
    { name: 'Active Jobs', value: activeJobs, icon: BriefcaseIcon, color: 'bg-blue-100 text-blue-600' },
    { name: 'Total Applicants', value: totalApplicants, icon: UserGroupIcon, color: 'bg-green-100 text-green-600' },
    { name: 'Saved Shortlists', value: shortlists.length, icon: StarIcon, color: 'bg-cyan-100 text-cyan-600' },
    { name: 'Pending Review', value: pendingReview, icon: ClipboardDocumentListIcon, color: 'bg-teal-100 text-teal-600' },
  ];

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your recruitment activities</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Jobs</h2>
                <a href="/jobs" className="text-sm text-blue-600 hover:text-blue-800">View All</a>
              </div>
              <div className="space-y-4">
                {recentJobs.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No jobs yet. Create your first job.</p>
                ) : (
                  recentJobs.map((job) => (
                    <div key={job._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        job.status === 'active' ? 'bg-green-100 text-green-700' :
                        job.status === 'inactive' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Shortlists</h2>
                <a href="/shortlists" className="text-sm text-blue-600 hover:text-blue-800">View All</a>
              </div>
              <div className="space-y-4">
                {recentShortlists.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No shortlists yet. Run a screening to create one.</p>
                ) : (
                  recentShortlists.map((shortlist: any) => (
                    <div key={shortlist._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{shortlist.title}</h3>
                        <p className="text-sm text-gray-600">
                          {(shortlist.jobId as any)?.title || 'Unknown Job'} • {shortlist.candidates?.length || 0} candidates
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {new Date(shortlist.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/jobs" className="card p-6 hover:shadow-md transition-shadow border-l-4 border-blue-500">
                <BriefcaseIcon className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-medium text-gray-900">Create Job</h3>
                <p className="text-sm text-gray-600 mt-1">Post a new job position</p>
              </a>
              <a href="/applicants" className="card p-6 hover:shadow-md transition-shadow border-l-4 border-green-500">
                <UserGroupIcon className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-medium text-gray-900">Add Applicants</h3>
                <p className="text-sm text-gray-600 mt-1">Import or add candidates</p>
              </a>
              <a href="/screening" className="card p-6 hover:shadow-md transition-shadow border-l-4 border-cyan-500">
                <ClipboardDocumentListIcon className="w-8 h-8 text-cyan-600 mb-3" />
                <h3 className="font-medium text-gray-900">Run Screening</h3>
                <p className="text-sm text-gray-600 mt-1">AI-powered candidate ranking</p>
              </a>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
