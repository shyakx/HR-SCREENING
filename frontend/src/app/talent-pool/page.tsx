'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchApplicants } from '@/store/slices/applicantsSlice';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  UserGroupIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function TalentPoolPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { applicants, loading } = useSelector((state: RootState) => state.applicants);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterExperience, setFilterExperience] = useState('all');
  const [filterSkills, setFilterSkills] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    dispatch(fetchApplicants());
  }, [dispatch]);

  const filteredApplicants = applicants
    .filter(applicant => {
      const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           applicant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesExperience = filterExperience === 'all' || applicant.experience.level === filterExperience;
      const hasSelectedSkill = filterSkills === 'all' || applicant.skills.includes(filterSkills);
      const matchesLocationFilter = filterLocation === 'all' || 
        applicant.location.toLowerCase().includes(filterLocation.toLowerCase());
      
      return matchesSearch && matchesExperience && hasSelectedSkill && matchesLocationFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return b.experience.years - a.experience.years;
        case 'skills':
          return b.skills.length - a.skills.length;
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

  const allSkills = Array.from(new Set(applicants.flatMap(applicant => applicant.skills)));
  const allLocations = Array.from(new Set(applicants.map(applicant => applicant.location)));
  const experienceLevels = ['entry', 'mid', 'senior', 'executive'];

  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-green-100 text-green-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceLevelLabel = (level: string) => {
    switch (level) {
      case 'entry': return 'Entry Level';
      case 'mid': return 'Mid Level';
      case 'senior': return 'Senior Level';
      case 'executive': return 'Executive';
      default: return level;
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading talent pool...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Talent Pool</h1>
        <p className="text-gray-500 mt-2 text-base">Manage and explore your candidate database</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <UserGroupIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-3xl font-bold text-gray-900">{applicants.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <BriefcaseIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Senior Level</p>
              <p className="text-3xl font-bold text-gray-900">
                {applicants.filter(a => a.experience.level === 'senior').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Experience</p>
              <p className="text-3xl font-bold text-gray-900">
                {applicants.length > 0 ? Math.round(applicants.reduce((sum, a) => sum + a.experience.years, 0) / applicants.length) : 0}y
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <StarIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Skills</p>
              <p className="text-3xl font-bold text-gray-900">{allSkills.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Filter Candidates</h2>
          <div className="text-sm text-gray-600">
            {filteredApplicants.length} of {applicants.length} candidates
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates..."
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <select
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Levels</option>
              {experienceLevels.map(level => (
                <option key={level} value={level}>
                  {getExperienceLevelLabel(level)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
            <select
              value={filterSkills}
              onChange={(e) => setFilterSkills(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Locations</option>
              {allLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input w-full"
            >
              <option value="name">Name</option>
              <option value="experience">Experience</option>
              <option value="skills">Skills Count</option>
              <option value="location">Location</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      {filteredApplicants.length === 0 ? (
        <div className="card p-12 text-center">
          <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-600 mb-6">
            {applicants.length === 0 
              ? 'No candidates in your talent pool yet. Start adding candidates to build your database.'
              : 'Try adjusting your filters to see more candidates.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplicants.map((applicant) => (
            <div key={applicant._id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{applicant.name}</h3>
                  <p className="text-sm text-gray-600">{applicant.email}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {applicant.location}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getExperienceLevelColor(applicant.experience.level)}`}>
                  {getExperienceLevelLabel(applicant.experience.level)}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium text-gray-900">{applicant.experience.years} years</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Skills</span>
                  <span className="font-medium text-gray-900">{applicant.skills.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Education</span>
                  <span className="font-medium text-gray-900">{applicant.education.length}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {applicant.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                      {skill}
                    </span>
                  ))}
                  {applicant.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
                      +{applicant.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-xs text-gray-500">
                  Added {new Date(typeof applicant.createdAt === 'string' ? applicant.createdAt : applicant.createdAt.toISOString()).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
