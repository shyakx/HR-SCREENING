'use client'

import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="fixed left-0 top-0 h-screen z-50">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64">
          <Header />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
