'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicants, createApplicant, updateApplicant, deleteApplicant, uploadApplicants } from '@/store/slices/applicantsSlice';
import { RootState, AppDispatch } from '@/store';
import { AppLayout } from '@/components/layout/AppLayout';
import { Applicant } from '@/types';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  location: '',
  experience: { years: 0, level: 'mid' as 'entry' | 'mid' | 'senior' | 'executive' },
  skills: [] as string[],
  education: [] as { degree: string; field: string; institution: string; year: number }[],
  workHistory: [] as { company: string; position: string; duration: string; description: string }[],
  source: 'external' as 'umurava' | 'external',
};

export default function ApplicantsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { applicants, loading, uploadProgress } = useSelector((state: RootState) => state.applicants);
  
  const [showModal, setShowModal] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [skillInput, setSkillInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchApplicants());
  }, [dispatch]);

  const handleOpenModal = (applicant?: Applicant) => {
    if (applicant) {
      setEditingApplicant(applicant);
      setFormData({
        name: applicant.name,
        email: applicant.email,
        phone: applicant.phone,
        location: applicant.location,
        experience: { ...applicant.experience },
        skills: [...applicant.skills],
        education: [...applicant.education],
        workHistory: [...applicant.workHistory],
        source: applicant.source,
      });
    } else {
      setEditingApplicant(null);
      setFormData(initialFormData);
    }
    setSkillInput('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingApplicant(null);
    setFormData(initialFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApplicant) {
      dispatch(updateApplicant({ id: editingApplicant._id, applicantData: formData }));
    } else {
      dispatch(createApplicant(formData));
    }
    handleCloseModal();
  };

  const handleDelete = (applicantId: string) => {
    dispatch(deleteApplicant(applicantId));
    setDeleteConfirm(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      dispatch(uploadApplicants(file)).finally(() => {
        setUploading(false);
        event.target.value = '';
      });
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: '', field: '', institution: '', year: new Date().getFullYear() }]
    });
  };

  const updateEducation = (index: number, field: string, value: string | number) => {
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData({ ...formData, education: newEducation });
  };

  const removeEducation = (index: number) => {
    setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
  };

  const addWorkHistory = () => {
    setFormData({
      ...formData,
      workHistory: [...formData.workHistory, { company: '', position: '', duration: '', description: '' }]
    });
  };

  const updateWorkHistory = (index: number, field: string, value: string) => {
    const newWorkHistory = [...formData.workHistory];
    newWorkHistory[index] = { ...newWorkHistory[index], [field]: value };
    setFormData({ ...formData, workHistory: newWorkHistory });
  };

  const removeWorkHistory = (index: number) => {
    setFormData({ ...formData, workHistory: formData.workHistory.filter((_, i) => i !== index) });
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Applicants</h1>
          <p className="text-gray-600 mt-1">Manage candidate profiles</p>
        </div>
        <div className="flex gap-4">
          <label className={`btn btn-secondary cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
            <span>{uploading ? `Uploading ${uploadProgress}%...` : 'Upload CSV/Excel'}</span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            + Add Applicant
          </button>
        </div>
      </div>

      {loading && !uploading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading applicants...</p>
        </div>
      ) : applicants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">No applicants found. Upload or add your first applicant.</p>
          <div className="flex justify-center gap-3">
            <label className={`btn btn-secondary cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
              <span>{uploading ? `Uploading ${uploadProgress}%...` : 'Upload CSV/Excel'}</span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <button onClick={() => handleOpenModal()} className="btn btn-primary">Add Applicant</button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {applicants.map((applicant) => (
            <div key={applicant._id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{applicant.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600">{applicant.email}</p>
                      <p className="text-gray-600">{applicant.phone}</p>
                      <p className="text-gray-600">{applicant.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{applicant.experience.years} years experience</p>
                      <p className="text-gray-600">{applicant.experience.level} level</p>
                      <p className="text-gray-600 capitalize">Source: {applicant.source}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-800 mb-2">Skills:</h3>
                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {applicant.education.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-800 mb-2">Education:</h3>
                      <div className="space-y-1">
                        {applicant.education.map((edu, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            {edu.degree} in {edu.field} from {edu.institution} ({edu.year})
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {applicant.workHistory.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Work History:</h3>
                      <div className="space-y-2">
                        {applicant.workHistory.map((work, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            <p className="font-medium">{work.position} at {work.company}</p>
                            <p>{work.duration}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleOpenModal(applicant)} className="btn btn-secondary">Edit</button>
                  <button onClick={() => setDeleteConfirm(applicant._id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingApplicant ? 'Edit Applicant' : 'Add New Applicant'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience.years}
                    onChange={(e) => setFormData({ ...formData, experience: { ...formData.experience, years: parseInt(e.target.value) || 0 } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                  <select
                    value={formData.experience.level}
                    onChange={(e) => setFormData({ ...formData, experience: { ...formData.experience, level: e.target.value as any } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="external">External</option>
                    <option value="umurava">Umurava</option>
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a skill"
                  />
                  <button type="button" onClick={addSkill} className="btn btn-secondary">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200 flex items-center gap-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="text-blue-500 hover:text-blue-700">x</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Education</label>
                  <button type="button" onClick={addEducation} className="text-sm text-blue-600 hover:text-blue-800">+ Add Education</button>
                </div>
                <div className="space-y-3">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg">
                      <input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                      />
                      <input
                        placeholder="Field"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                      />
                      <input
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="Year"
                          value={edu.year}
                          onChange={(e) => updateEducation(index, 'year', parseInt(e.target.value) || 0)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                        <button type="button" onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-700 px-1">x</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work History */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Work History</label>
                  <button type="button" onClick={addWorkHistory} className="text-sm text-blue-600 hover:text-blue-800">+ Add Position</button>
                </div>
                <div className="space-y-3">
                  {formData.workHistory.map((work, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          placeholder="Company"
                          value={work.company}
                          onChange={(e) => updateWorkHistory(index, 'company', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          placeholder="Position"
                          value={work.position}
                          onChange={(e) => updateWorkHistory(index, 'position', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          placeholder="Duration (e.g., 2020-2023)"
                          value={work.duration}
                          onChange={(e) => updateWorkHistory(index, 'duration', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                        <button type="button" onClick={() => removeWorkHistory(index)} className="text-red-500 hover:text-red-700 px-1">x</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingApplicant ? 'Update Applicant' : 'Add Applicant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this applicant? This action cannot be undone.</p>
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
