'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchApplicants, deleteApplicant } from '@/store/slices/applicantsSlice';
import { 
  UserGroupIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowUpIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

export default function ApplicantList() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { applicants, loading } = useSelector((state: RootState) => state.applicants);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterExperience, setFilterExperience] = useState('all');
  const [filterSkills, setFilterSkills] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    dispatch(fetchApplicants());
  }, [dispatch]);

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesExperience = filterExperience === 'all' || applicant.experience.level === filterExperience;
    const hasSelectedSkill = filterSkills === 'all' || applicant.skills.includes(filterSkills);
    
    return matchesSearch && matchesExperience && hasSelectedSkill;
  });

  const allSkills = Array.from(new Set(applicants.flatMap(applicant => applicant.skills)));
  const experienceLevels = ['entry', 'mid', 'senior', 'executive'];

  const handleDeleteApplicant = async (applicantId: string) => {
    try {
      await dispatch(deleteApplicant(applicantId)).unwrap();
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting applicant:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-green-100 text-green-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceIcon = (level: string) => {
    switch (level) {
      case 'entry': return 1;
      case 'mid': return 2;
      case 'senior': return 3;
      case 'executive': return 4;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicant Management</h1>
          <p className="text-gray-600 mt-1">Manage candidate profiles and applications</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn btn-secondary flex items-center"
          >
            <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
            Upload CSV
          </button>
          <button
            onClick={() => router.push('/applicants/create')}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Applicant
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          
          <select
            value={filterExperience}
            onChange={(e) => setFilterExperience(e.target.value)}
            className="input"
          >
            <option value="all">All Experience Levels</option>
            {experienceLevels.map(level => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)} Level
              </option>
            ))}
          </select>

          <select
            value={filterSkills}
            onChange={(e) => setFilterSkills(e.target.value)}
            className="input"
          >
            <option value="all">All Skills</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterExperience('all');
              setFilterSkills('all');
            }}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Applicants</p>
              <p className="text-2xl font-bold text-gray-900">{applicants.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Entry Level</p>
              <p className="text-2xl font-bold text-gray-900">
                {applicants.filter(a => a.experience.level === 'entry').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mid Level</p>
              <p className="text-2xl font-bold text-gray-900">
                {applicants.filter(a => a.experience.level === 'mid').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Senior+</p>
              <p className="text-2xl font-bold text-gray-900">
                {applicants.filter(a => ['senior', 'executive'].includes(a.experience.level)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Applicant List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredApplicants.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterExperience !== 'all' || filterSkills !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first applicant'}
            </p>
            {!searchTerm && filterExperience === 'all' && filterSkills === 'all' && (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => router.push('/applicants/create')}
                  className="btn btn-primary"
                >
                  Add Applicant
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn btn-secondary"
                >
                  Upload CSV
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserGroupIcon className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {applicant.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <EnvelopeIcon className="w-4 h-4" />
                            {applicant.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4" />
                            {applicant.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExperienceColor(applicant.experience.level)}`}>
                          {applicant.experience.level}
                        </span>
                        <span className="ml-2 text-sm text-gray-900">
                          {applicant.experience.years} years
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 text-gray-400 mr-1" />
                        {applicant.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {applicant.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {applicant.skills.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{applicant.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        applicant.source === 'umurava' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {applicant.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/applicants/${applicant._id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/applicants/${applicant._id}/edit`)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Applicant"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(applicant._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Applicant"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Delete Applicant
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this applicant? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3 flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteApplicant(showDeleteModal)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <DocumentArrowUpIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Upload Applicants
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  Upload a CSV or Excel file with applicant information.
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Drop your files here or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      CSV, XLSX files up to 10MB
                    </p>
                  </div>
                  <button className="mt-4 btn btn-secondary">
                    Select File
                  </button>
                </div>
              </div>
              <div className="items-center px-4 py-3 flex justify-center space-x-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
