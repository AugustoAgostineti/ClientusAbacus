
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
  AlertCircle, 
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
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Criar Conteúdo
            </Button>
          </Link>
          <Link href="/dashboard/agency/clients">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Gerenciar Clientes
            </Button>
          </Link>
          <Link href="/dashboard/agency/calendar">
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Ver Calendário
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

        {/* Recent Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Conteúdos Recentes</span>
              <Link href="/dashboard/agency/contents">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              Últimos conteúdos criados e seus status de aprovação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContent.map((content) => {
                const status = getStatusBadge(content.status)
                return (
                  <div
                    key={content.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                      <Link href={`/dashboard/agency/contents/${content.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Dicas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Use o calendário para planejar suas publicações com antecedência</li>
              <li>• Mantenha os clientes informados com comentários nas aprovações</li>
              <li>• Configure notificações para não perder nenhuma aprovação</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
