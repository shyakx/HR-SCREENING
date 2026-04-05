'use client'

import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Talent Screening Dashboard
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 relative transition-colors">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Recruiter</p>
              </div>
              <UserCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
