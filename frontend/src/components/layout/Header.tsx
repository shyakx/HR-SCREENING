'use client'

import { BellIcon, UserCircleIcon, XMarkIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Header() {
  const pathname = usePathname()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Jean-Pierre Mugisha',
    role: 'HR Manager'
  })

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Dashboard'
      case '/jobs':
        return 'Jobs'
      case '/applicants':
        return 'Applicants'
      case '/screening':
        return 'Screening'
      case '/shortlists':
        return 'Shortlists'
      default:
        return 'RecruitHub'
    }
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save to backend
    setShowProfileModal(false)
  }

  const handleLogout = () => {
    // Here you would typically handle logout logic
    console.log('Logging out...')
    // Redirect to login page or clear auth state
  }

  const handleSettings = () => {
    // Here you would navigate to settings page
    console.log('Opening settings...')
    setShowProfileMenu(false)
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b-4 border-gray-300">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="border-l-4 border-blue-600 pl-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {getPageTitle()}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-blue-600 relative transition-colors border-l-2 border-gray-200 pl-4">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full"></span>
              </button>
              
              <div className="relative">
                <div 
                  className="flex items-center space-x-3 border-l-2 border-gray-200 pl-4 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors" 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-900">{profile.name}</p>
                    <p className="text-xs text-gray-500">{profile.role}</p>
                  </div>
                  <div className="border-2 border-blue-600 rounded-full p-1">
                    <UserCircleIcon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false)
                        setShowProfileModal(true)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <UserCircleIcon className="h-4 w-4 text-gray-400" />
                      Edit Profile
                    </button>
                    <button 
                      onClick={handleSettings}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Cog6ToothIcon className="h-4 w-4 text-gray-400" />
                      Settings
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 text-red-400" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({...profile, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
