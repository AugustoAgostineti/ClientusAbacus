
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileImage, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Eye
} from 'lucide-react'
import Link from 'next/link'

export function ClientDashboard() {
  const { data: session } = useSession()

  const stats = [
    {
      title: 'Aguardando Aprovação',
      value: '5',
      change: '+2',
      trend: 'up',
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Aprovados',
      value: '18',
      change: '+6',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Publicados',
      value: '15',
      change: '+3',
      trend: 'up',
      icon: FileImage,
      color: 'text-blue-600'
    },
    {
      title: 'Este Mês',
      value: '23',
      change: '+12',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-600'
    }
  ]

  const [pendingContent, setPendingContent] = useState<any[]>([])

  useEffect(() => {
    const fetchPendingContent = async () => {
      try {
        const response = await fetch('/api/contents?status=PENDING_APPROVAL')
        if (response.ok) {
          const data = await response.json()
          setPendingContent(data.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching pending content:', error)
      }
    }
    
    fetchPendingContent()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'PENDING_APPROVAL': { label: 'Pendente', variant: 'secondary' as const },
      'APPROVED': { label: 'Aprovado', variant: 'default' as const },
      'REVISION_REQUESTED': { label: 'Revisão Solicitada', variant: 'destructive' as const },
      'REJECTED': { label: 'Rejeitado', variant: 'destructive' as const },
      'PUBLISHED': { label: 'Publicado', variant: 'default' as const }
    }
    
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const }
  }

  const getPlatformBadge = (platform: string) => {
    const colors = {
      'Instagram': 'bg-pink-100 text-pink-800',
      'Facebook': 'bg-blue-100 text-blue-800',
      'TikTok': 'bg-black text-white',
      'YouTube': 'bg-red-100 text-red-800'
    }
    
    return colors[platform as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <DashboardLayout
      title={`Bem-vindo, ${session?.user?.name}`}
      description="Acompanhe e aprove os conteúdos criados para suas redes sociais"
    >
      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/client/approvals">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Eye className="mr-2 h-4 w-4" />
              Ver Aprovações Pendentes
            </Button>
          </Link>
          <Link href="/dashboard/client/calendar">
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Calendário de Publicações
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className={`h-3 w-3 mr-1 ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className={`text-xs ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Aprovações Pendentes</span>
              <Link href="/dashboard/client/approvals">
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              Conteúdos aguardando sua aprovação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingContent.map((content) => {
                const status = getStatusBadge(content.status)
                return (
                  <div
                    key={content.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {content.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {content.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(content.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {content.platforms?.map((platform: string) => (
                          <span
                            key={platform}
                            className={`px-2 py-1 text-xs rounded-full ${getPlatformBadge(platform)}`}
                          >
                            {platform}
                          </span>
                        )) || []}
                      </div>
                      
                      <div className="flex gap-2">
                        {content.status === 'PENDING_APPROVAL' && (
                          <>
                            <Button variant="outline" size="sm">
                              Solicitar Alteração
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Aprovar
                            </Button>
                          </>
                        )}
                        {content.status === 'REVISION_REQUESTED' && (
                          <Button variant="outline" size="sm">
                            Ver Alterações
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>


      </div>
    </DashboardLayout>
  )
}
