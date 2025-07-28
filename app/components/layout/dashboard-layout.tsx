
'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <main className="p-6">
          {(title || description) && (
            <header className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-gray-600">
                  {description}
                </p>
              )}
            </header>
          )}
          
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
