'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShortlists, deleteShortlist } from '@/store/slices/screeningSlice';
import { RootState, AppDispatch } from '@/store';
import { AppLayout } from '@/components/layout/AppLayout';
import { Shortlist } from '@/types';

export default function ShortlistsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { shortlists, loading } = useSelector((state: RootState) => state.screening);
  
  const [viewShortlist, setViewShortlist] = useState<Shortlist | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchShortlists());
  }, [dispatch]);

  const handleDelete = (shortlistId: string) => {
    dispatch(deleteShortlist(shortlistId));
    setDeleteConfirm(null);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'highly-recommended': return 'bg-green-100 text-green-700 border-green-300';
      case 'recommended': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'consider': return 'bg-cyan-100 text-cyan-700 border-cyan-300';
      case 'not-recommended': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Shortlists</h1>
          <p className="text-gray-600 mt-1">View and manage saved candidate shortlists</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading shortlists...</p>
        </div>
      ) : shortlists.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">No shortlists yet. Run a screening and save results to create your first shortlist.</p>
          <a href="/screening" className="btn btn-primary">Go to Screening</a>
        </div>
      ) : (
        <div className="grid gap-6">
          {shortlists.map((shortlist: any) => (
            <div key={shortlist._id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">{shortlist.title}</h2>
                  <p className="text-gray-600">
                    For: <span className="font-medium">{(shortlist.jobId as any)?.title || 'Unknown Job'}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Created {new Date(shortlist.createdAt).toLocaleDateString()} • {shortlist.candidates?.length || 0} candidates selected from {shortlist.totalApplicants} applicants
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setViewShortlist(shortlist)}
                    className="btn btn-secondary"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(shortlist._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-800 mb-3">Top Candidates:</h3>
                <div className="grid gap-3">
                  {shortlist.candidates?.slice(0, 3).map((candidate: any) => (
                    <div key={candidate._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                        candidate.matchScore >= 80 ? 'bg-green-100 text-green-700 border-green-400' :
                        candidate.matchScore >= 60 ? 'bg-blue-100 text-blue-700 border-blue-400' :
                        candidate.matchScore >= 40 ? 'bg-cyan-100 text-cyan-700 border-cyan-400' :
                        'bg-gray-100 text-gray-600 border-gray-300'
                      }`}>
                        {candidate.matchScore}%
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {(candidate.applicantId as any)?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Rank #{candidate.rank} • {(candidate.applicantId as any)?.email}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRecommendationColor(candidate.recommendation)}`}>
                        {candidate.recommendation.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                  {shortlist.candidates?.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{shortlist.candidates.length - 3} more candidates
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Shortlist Modal */}
      {viewShortlist && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{viewShortlist.title}</h3>
                <p className="text-gray-600">
                  For: {(viewShortlist.jobId as any)?.title}
                </p>
              </div>
              <button 
                onClick={() => setViewShortlist(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              {viewShortlist.candidates?.map((candidate: any) => (
                <div key={candidate._id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 ${
                      candidate.matchScore >= 80 ? 'bg-green-100 text-green-700 border-green-400' :
                      candidate.matchScore >= 60 ? 'bg-blue-100 text-blue-700 border-blue-400' :
                      candidate.matchScore >= 40 ? 'bg-cyan-100 text-cyan-700 border-cyan-400' :
                      'bg-gray-100 text-gray-600 border-gray-300'
                    }`}>
                      {candidate.matchScore}%
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {(candidate.applicantId as any)?.name || 'Unknown Candidate'}
                          </h4>
                          <p className="text-gray-600">{(candidate.applicantId as any)?.email}</p>
                          <p className="text-sm text-gray-500">
                            Rank #{candidate.rank} • {(candidate.applicantId as any)?.experience?.years} years experience
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRecommendationColor(candidate.recommendation)}`}>
                          {candidate.recommendation.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{candidate.reasoning}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-green-700 mb-2">Strengths</h5>
                      <ul className="space-y-1">
                        {candidate.strengths.map((strength: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="text-green-500 mr-2">+</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Gaps</h5>
                      <ul className="space-y-1">
                        {candidate.gaps.map((gap: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="text-gray-400 mr-2">-</span>
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this shortlist? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
