
'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileImage,
  Users,
  Calendar,
  MessageSquare,
  Bell,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCircle,
  Grid3X3
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isAgency = session?.user?.role === 'ADMIN_AGENCY' || session?.user?.role === 'EMPLOYEE_AGENCY'
  const isClient = session?.user?.role === 'CLIENT'

  const agencyNavItems = [
    { name: 'Dashboard', href: '/dashboard/agency', icon: LayoutDashboard },
    { name: 'Conteúdos', href: '/dashboard/agency/contents', icon: FileImage },
    { name: 'Clientes', href: '/dashboard/agency/clients', icon: Users },
    { name: 'Calendário', href: '/dashboard/agency/calendar', icon: Calendar },
    { name: 'Comentários', href: '/dashboard/agency/comments', icon: MessageSquare },
    { name: 'Notificações', href: '/dashboard/agency/notifications', icon: Bell },
    { name: 'Documentos', href: '/dashboard/agency/documents', icon: FileText },
  ]

  const clientNavItems = [
    { name: 'Dashboard', href: '/dashboard/client', icon: LayoutDashboard },
    { name: 'Posts', href: '/dashboard/client/posts', icon: Grid3X3 },
    { name: 'Aprovações', href: '/dashboard/client/approvals', icon: CheckCircle },
    { name: 'Calendário', href: '/dashboard/client/calendar', icon: Calendar },
    { name: 'Documentos', href: '/dashboard/client/documents', icon: FileText },
  ]

  const navItems = isAgency ? agencyNavItems : clientNavItems

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white/70 backdrop-blur-md border-white/40 hover:bg-white/80 transition-all duration-250"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white/70 backdrop-blur-md border-r border-white/40 transform transition-transform duration-200 ease-in-out lg:translate-x-0 shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-white/40">
            <h1 className="text-xl font-bold text-gray-900">
              Social Media
            </h1>
          </div>

          {/* User info */}
          <div className="px-4 py-4 border-b border-white/40 bg-white/30 backdrop-blur-sm">
            <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
            <p className="text-xs text-gray-600">{session?.user?.email}</p>
            <p className="text-xs text-[#5C7CFA] font-medium mt-1">
              {isAgency ? 'Agência' : 'Cliente'}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-250 ease-out backdrop-blur-sm",
                    isActive
                      ? "bg-gradient-to-r from-[#5C7CFA] to-[#7C94FB] text-white shadow-[0_4px_16px_rgba(92,124,250,0.25)] scale-[1.02]"
                      : "text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:scale-[1.01] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-white/40">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start bg-white/30 hover:bg-white/50 backdrop-blur-sm transition-all duration-250 hover:scale-[1.01] rounded-xl"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
