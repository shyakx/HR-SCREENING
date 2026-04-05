'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '@/store/slices/jobsSlice';
import { fetchApplicants } from '@/store/slices/applicantsSlice';
import { runScreening, clearError, createShortlist } from '@/store/slices/screeningSlice';
import { RootState, AppDispatch } from '@/store';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Check, 
  Briefcase, 
  Users, 
  Sparkles, 
  Bookmark,
  X,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  Loader2,
  ChevronRight,
  Building2,
  MapPin
} from 'lucide-react';

export default function ScreeningPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [showShortlistModal, setShowShortlistModal] = useState(false);
  const [shortlistTitle, setShortlistTitle] = useState('');

  const { jobs, loading: jobsLoading } = useSelector((state: RootState) => state.jobs);
  const { applicants, loading: applicantsLoading } = useSelector((state: RootState) => state.applicants);
  const { results, loading: screeningLoading, error } = useSelector((state: RootState) => state.screening);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchApplicants());
  }, [dispatch]);

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId);
    setSelectedApplicants([]);
    dispatch(clearError());
  };

  const handleApplicantToggle = (applicantId: string) => {
    setSelectedApplicants(prev => 
      prev.includes(applicantId) 
        ? prev.filter(id => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  const handleRunScreening = () => {
    if (selectedJob && selectedApplicants.length > 0) {
      dispatch(runScreening({ jobId: selectedJob, applicantIds: selectedApplicants }));
    }
  };

  const handleSelectAllApplicants = () => {
    if (selectedApplicants.length === applicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(applicants.map(a => a._id));
    }
  };

  const handleSaveShortlist = () => {
    if (selectedJob && shortlistTitle && results.length > 0) {
      const candidateIds = results.map(r => r._id);
      dispatch(createShortlist({ jobId: selectedJob, title: shortlistTitle, candidateIds }));
      setShowShortlistModal(false);
      setShortlistTitle('');
    }
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'highly-recommended': 
        return { 
          class: 'rec-highly', 
          icon: <Award className="w-3.5 h-3.5 mr-1.5" />,
          label: 'Highly Recommended'
        };
      case 'recommended': 
        return { 
          class: 'rec-recommended', 
          icon: <Check className="w-3.5 h-3.5 mr-1.5" />,
          label: 'Recommended'
        };
      case 'consider': 
        return { 
          class: 'rec-consider', 
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1.5" />,
          label: 'Consider'
        };
      case 'not-recommended': 
        return { 
          class: 'rec-not', 
          icon: <X className="w-3.5 h-3.5 mr-1.5" />,
          label: 'Not Recommended'
        };
      default: 
        return { 
          class: 'bg-gray-100 text-gray-600 border border-gray-200', 
          icon: null,
          label: 'Pending'
        };
    }
  };

  const getScoreStyle = (score: number) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-mid';
    if (score >= 40) return 'score-low';
    return 'score-poor';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair';
    return 'Low Match';
  };

  const loading = jobsLoading || applicantsLoading;
  const canRunScreening = selectedJob && selectedApplicants.length > 0 && !screeningLoading;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-800">AI Screening</h1>
              </div>
              <p className="text-gray-500 ml-[52px]">
                Match candidates to positions with intelligent analysis
              </p>
            </div>
            <button 
              onClick={handleRunScreening}
              disabled={!canRunScreening}
              className={`btn btn-primary px-5 ${!canRunScreening ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {screeningLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Run Analysis
                </>
              )}
            </button>
          </div>
          
          {!canRunScreening && !loading && (
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
              <div className={`flex items-center gap-2 ${selectedJob ? 'text-blue-600' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  selectedJob ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  1
                </div>
                <span>Select position</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
              <div className={`flex items-center gap-2 ${selectedApplicants.length > 0 ? 'text-blue-600' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  selectedApplicants.length > 0 ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  2
                </div>
                <span>Choose candidates</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                  3
                </div>
                <span>Review matches</span>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-red-700 font-medium">{error}</span>
                {(error.includes('busy') || error.includes('wait') || error.includes('retry')) && (
                  <div className="mt-2 flex items-center gap-3">
                    <button 
                      onClick={handleRunScreening}
                      disabled={!canRunScreening}
                      className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                    >
                      Try Again
                    </button>
                    <span className="text-sm text-red-600">
                      AI services may need time between requests
                    </span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => dispatch(clearError())} 
                className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-100 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 rounded-full border-3 border-blue-100 border-t-blue-600 animate-spin" />
            <p className="text-gray-500 mt-4">
              {screeningLoading ? 'AI analyzing candidates...' : 'Loading...'}
            </p>
            {screeningLoading && (
              <p className="text-sm text-gray-400 mt-2 text-center max-w-md">
                This may take 30-60 seconds as our AI evaluates each candidate against the job requirements
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Selection Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {/* Job Selection */}
              <div className="section-panel p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-800">Position</h2>
                    {selectedJob && (
                      <p className="text-sm text-blue-600">
                        {jobs.find(j => j._id === selectedJob)?.title}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 max-h-[360px] overflow-y-auto scroll-custom pr-2">
                  {jobs.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No positions created yet</p>
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <div 
                        key={job._id} 
                        onClick={() => handleJobSelect(job._id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          selectedJob === job._id 
                            ? 'bg-blue-50 border-blue-300 shadow-sm' 
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedJob === job._id 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300'
                          }`}>
                            {selectedJob === job._id && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-800">{job.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5" />
                                {job.department}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {job.location}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="badge badge-gray">{job.experienceLevel}</span>
                              <span className="badge badge-blue">{job.skills.length} skills required</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Candidate Selection */}
              <div className="section-panel p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-800">Candidates</h2>
                      {selectedApplicants.length > 0 && (
                        <p className="text-sm text-green-600">{selectedApplicants.length} selected</p>
                      )}
                    </div>
                  </div>
                  {applicants.length > 0 && (
                    <button 
                      onClick={handleSelectAllApplicants}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      {selectedApplicants.length === applicants.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>
                
                <div className="space-y-3 max-h-[360px] overflow-y-auto scroll-custom pr-2">
                  {applicants.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No candidates added yet</p>
                    </div>
                  ) : (
                    applicants.map((applicant) => (
                      <div 
                        key={applicant._id} 
                        onClick={() => handleApplicantToggle(applicant._id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          selectedApplicants.includes(applicant._id)
                            ? 'bg-blue-50 border-blue-300 shadow-sm' 
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                            selectedApplicants.includes(applicant._id)
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300'
                          }`}>
                            {selectedApplicants.includes(applicant._id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-800">{applicant.name}</h3>
                            <p className="text-sm text-gray-500">{applicant.email}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="badge badge-gray">{applicant.experience.years}y exp</span>
                              <span className="badge badge-green">{applicant.skills.length} skills</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {applicant.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                  {skill}
                                </span>
                              ))}
                              {applicant.skills.length > 3 && (
                                <span className="text-xs text-gray-400">+{applicant.skills.length - 3}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-800">Match Results</h2>
                      <p className="text-sm text-gray-500">{results.length} candidates analyzed</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowShortlistModal(true)}
                    className="btn btn-secondary"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save Shortlist
                  </button>
                </div>

                <div className="space-y-4">
                  {results.map((result) => {
                    const recBadge = getRecommendationBadge(result.recommendation);
                    return (
                      <div key={result._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors shadow-sm">
                        <div className="flex items-start gap-5">
                          <div className="flex-shrink-0 flex flex-col items-center">
                            <div className={`score-circle ${getScoreStyle(result.matchScore)}`}>
                              {result.matchScore}%
                            </div>
                            <span className="text-xs text-gray-500 mt-2 font-medium">
                              {getScoreLabel(result.matchScore)}
                            </span>
                            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                              <span className="font-semibold text-blue-700">#{result.rank}</span>
                              <span className="text-gray-400">/</span>
                              <span>{results.length}</span>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {(result.applicantId as any)?.name || 'Unknown'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {(result.applicantId as any)?.email || ''}
                                </p>
                              </div>
                              <span className={`rec-badge ${recBadge.class}`}>
                                {recBadge.icon}
                                {recBadge.label}
                              </span>
                            </div>

                            <p className="text-gray-600 mb-5 leading-relaxed">{result.reasoning}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4" />
                                  Strengths
                                </h4>
                                <ul className="space-y-2">
                                  {result.strengths.map((strength, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                                      {strength}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                                  <TrendingDown className="w-4 h-4" />
                                  Gaps
                                </h4>
                                <ul className="space-y-2">
                                  {result.gaps.map((gap, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                                      {gap}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Shortlist Modal */}
        {showShortlistModal && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Save Shortlist</h3>
                  <p className="text-sm text-gray-500">{results.length} candidates</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="label">Shortlist Name</label>
                <input
                  type="text"
                  value={shortlistTitle}
                  onChange={(e) => setShortlistTitle(e.target.value)}
                  placeholder="e.g., Top Frontend Developers"
                  className="input"
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowShortlistModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveShortlist}
                  disabled={!shortlistTitle}
                  className={`btn btn-primary ${!shortlistTitle ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
