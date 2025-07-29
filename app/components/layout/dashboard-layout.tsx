
'use client'

import { ReactNode, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Sidebar } from './sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, Settings, User, ChevronDown } from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-white/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {title && (
                <h1 className="text-2xl font-bold text-gray-900">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-sm text-gray-600 mt-1">
                  {description}
                </p>
              )}
            </div>
            
            {/* Right Side - User Info, Notifications, Settings */}
            <div className="flex items-center gap-3">
              {/* Notifications Dropdown */}
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl transition-all duration-250 hover:scale-[1.02]"
                  >
                    <Bell className="h-4 w-4" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-red-500"
                    >
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white/90 backdrop-blur-md border-white/40">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notificações
                    <Badge variant="secondary" className="text-xs">3 novas</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start py-3">
                    <div className="font-medium text-sm">Nova aprovação solicitada</div>
                    <div className="text-xs text-gray-500 mt-1">O conteúdo "Post Instagram" precisa da sua aprovação</div>
                    <div className="text-xs text-gray-400 mt-1">2 min atrás</div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start py-3">
                    <div className="font-medium text-sm">Conteúdo aprovado</div>
                    <div className="text-xs text-gray-500 mt-1">Seu post foi aprovado e agendado</div>
                    <div className="text-xs text-gray-400 mt-1">1 hora atrás</div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start py-3">
                    <div className="font-medium text-sm">Comentário adicionado</div>
                    <div className="text-xs text-gray-500 mt-1">Novo comentário em "Campanha Verão"</div>
                    <div className="text-xs text-gray-400 mt-1">3 horas atrás</div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-sm text-[#5C7CFA] hover:text-[#5C7CFA]">
                    Ver todas as notificações
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl transition-all duration-250 hover:scale-[1.02]"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-md border-white/40">
                  <DropdownMenuLabel>Configurações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Notificações
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Preferências
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Info */}
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#5C7CFA] to-[#7C94FB] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">
                    {session?.user?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {session?.user?.role === 'CLIENT' ? 'Cliente' : 'Agência'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
