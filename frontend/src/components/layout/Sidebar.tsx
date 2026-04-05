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
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-950 shadow-xl flex flex-col h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">HR Screening</h1>
        <p className="text-sm text-blue-200 mt-1">Powered by AI</p>
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
                  group flex items-center px-3 py-3 text-sm font-medium rounded-lg mb-2 transition-all
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5 flex-shrink-0 transition-colors
                    ${isActive ? 'text-green-400' : 'text-blue-300 group-hover:text-green-400'}
                  `}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-6">
        <div className="bg-blue-800/50 rounded-lg p-4 border border-blue-700">
          <h3 className="text-sm font-medium text-white">Umurava AI Hackathon</h3>
          <p className="text-xs text-blue-200 mt-1">Talent Screening Solution</p>
        </div>
      </div>
    </div>
  )
}
