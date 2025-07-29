
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileImage, 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Plus
} from 'lucide-react'
import Link from 'next/link'

export function AgencyDashboard() {
  const { data: session } = useSession()

  const stats = [
    {
      title: 'Conteúdos Ativos',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: FileImage,
      color: 'text-blue-600'
    },
    {
      title: 'Clientes',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Pendentes',
      value: '12',
      change: '-3',
      trend: 'down',
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Aprovados Hoje',
      value: '6',
      change: '+4',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-emerald-600'
    }
  ]

  const [recentContent, setRecentContent] = useState<any[]>([])

  useEffect(() => {
    const fetchRecentContent = async () => {
      try {
        const response = await fetch('/api/contents')
        if (response.ok) {
          const data = await response.json()
          setRecentContent(data.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching recent content:', error)
      }
    }
    
    fetchRecentContent()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'PENDING_APPROVAL': { label: 'Pendente', variant: 'secondary' as const },
      'APPROVED': { label: 'Aprovado', variant: 'default' as const },
      'REVISION_REQUESTED': { label: 'Revisão', variant: 'destructive' as const },
      'REJECTED': { label: 'Rejeitado', variant: 'destructive' as const },
      'PUBLISHED': { label: 'Publicado', variant: 'default' as const }
    }
    
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const }
  }

  return (
    <DashboardLayout
      title={`Bem-vindo, ${session?.user?.name}`}
      description="Gerencie seus conteúdos e acompanhe as aprovações dos clientes"
    >
      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/agency/contents/new">
            <button className="inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl bg-gradient-to-r from-[#5C7CFA] to-[#7C94FB] text-white border border-white/40 hover:from-[#4C6CF9] hover:to-[#6C84FB] hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(92,124,250,0.25)] active:scale-[0.98] shadow-[0_4px_16px_rgba(92,124,250,0.15)] backdrop-blur-md transition-all duration-250 ease-out">
              <Plus className="mr-2 h-4 w-4" />
              Criar Conteúdo
            </button>
          </Link>
          <Link href="/dashboard/agency/clients">
            <button className="inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/70 hover:scale-[1.01] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-250 ease-out">
              <Users className="mr-2 h-4 w-4" />
              Gerenciar Clientes
            </button>
          </Link>
          <Link href="/dashboard/agency/calendar">
            <button className="inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/70 hover:scale-[1.01] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-250 ease-out">
              <Clock className="mr-2 h-4 w-4" />
              Ver Calendário
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.title} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:scale-[1.01] transition-all duration-250 ease-out">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                  <h3 className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </h3>
                  <Icon className="h-5 w-5 text-[#5C7CFA]" />
                </div>
                <div className="px-6 pb-6">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className={`h-3 w-3 mr-1 ${
                      stat.trend === 'up' ? 'text-[#B4F461]' : 'text-red-500'
                    }`} />
                    <span className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-[#B4F461]' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Content */}
        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-250">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900">Conteúdos Recentes</h2>
              <Link href="/dashboard/agency/contents">
                <button className="px-3 py-1 text-sm font-medium rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/70 hover:scale-[1.01] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-250 ease-out">
                  Ver todos
                </button>
              </Link>
            </div>
            <p className="text-gray-600 mb-6">
              Últimos conteúdos criados e seus status de aprovação
            </p>
            <div className="space-y-4">
              {recentContent.map((content) => {
                const status = getStatusBadge(content.status)
                return (
                  <div
                    key={content.id}
                    className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/70 hover:scale-[1.01] transition-all duration-250 ease-out"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {content.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {content.assignee?.name || 'Sem cliente'} • {new Date(content.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-[#D8C8F7] to-[#E8D8FF] text-[#5C7CFA] border border-white/40 backdrop-blur-sm">
                        {status.label}
                      </span>
                      <Link href={`/dashboard/agency/contents/${content.id}`}>
                        <button className="px-3 py-1 text-sm font-medium rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/70 hover:scale-[1.01] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-250 ease-out">
                          Ver
                        </button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>


      </div>
    </DashboardLayout>
  )
}
