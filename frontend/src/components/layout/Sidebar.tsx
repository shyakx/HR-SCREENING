'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon,
  ChartBarIcon,
  StarIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/', icon: ChartBarIcon },
  { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  { name: 'Applicants', href: '/applicants', icon: UserGroupIcon },
  { name: 'Screening', href: '/screening', icon: ClipboardDocumentListIcon },
  { name: 'Shortlists', href: '/shortlists', icon: StarIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-blue-600 flex flex-col h-screen border-r-4 border-blue-600">
      <div className="p-6 border-b-2 border-blue-700">
        <div className="flex items-center gap-3">
          <img src="/image.png" alt="RecruitHub" className="w-10 h-10 rounded-lg" />
          <div>
            <h1 className="text-2xl font-bold text-white">RecruitHub</h1>
            <p className="text-sm text-blue-100 mt-1">Talent Management</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 flex-1">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2 text-base font-medium rounded-r-lg mb-1 transition-colors border-l-4
                  ${isActive
                    ? 'bg-blue-700 text-white border-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white border-transparent'
                  }
                `}
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-6 border-t-2 border-blue-700">
        <div className="bg-blue-700 rounded-r-lg p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-white">HR Platform</h3>
          <p className="text-xs text-blue-100 mt-1">Talent Screening Solution</p>
        </div>
      </div>
    </div>
  )
}
