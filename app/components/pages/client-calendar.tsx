
'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Share2
} from 'lucide-react'

export function ClientCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [contents, setContents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScheduledContents()
  }, [currentDate])

  const fetchScheduledContents = async () => {
    try {
      const response = await fetch('/api/contents')
      if (response.ok) {
        const data = await response.json()
        setContents(data.filter((content: any) => content.scheduledDate))
      }
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getContentsForDate = (date: Date | null) => {
    if (!date) return []
    
    return contents.filter(content => {
      const scheduledDate = new Date(content.scheduledDate)
      return (
        scheduledDate.getDate() === date.getDate() &&
        scheduledDate.getMonth() === date.getMonth() &&
        scheduledDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING_APPROVAL': 'bg-yellow-200 text-yellow-800',
      'APPROVED': 'bg-green-200 text-green-800',
      'REVISION_REQUESTED': 'bg-red-200 text-red-800',
      'PUBLISHED': 'bg-blue-200 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-200 text-gray-800'
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  if (loading) {
    return (
      <DashboardLayout title="Calendário" description="Visualize suas publicações agendadas">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Calendário de Publicações"
      description="Acompanhe quando seus conteúdos serão publicados"
    >
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-6">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                const dayContents = getContentsForDate(date)
                const isToday = date && 
                  date.getDate() === new Date().getDate() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear()
                
                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border border-gray-200 ${
                      date ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                    } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-2 ${
                          isToday ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayContents.slice(0, 3).map((content: any) => (
                            <div
                              key={content.id}
                              className={`text-xs p-1 rounded truncate ${getStatusColor(content.status)}`}
                              title={content.title}
                            >
                              {content.title}
                            </div>
                          ))}
                          {dayContents.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{dayContents.length - 3} mais
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Legenda de Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                <span className="text-sm">Aguardando Aprovação</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 rounded"></div>
                <span className="text-sm">Aprovado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 rounded"></div>
                <span className="text-sm">Revisão Solicitada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200 rounded"></div>
                <span className="text-sm">Publicado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Publications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Próximas Publicações
            </CardTitle>
            <CardDescription>
              Seus conteúdos agendados para os próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contents
                .filter(content => new Date(content.scheduledDate) > new Date())
                .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                .slice(0, 5)
                .map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {content.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(content.scheduledDate).toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {content.status === 'PENDING_APPROVAL' && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pendente
                        </Badge>
                      )}
                      {content.status === 'APPROVED' && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Pronto
                        </Badge>
                      )}
                      {content.status === 'PUBLISHED' && (
                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                          <Share2 className="h-3 w-3 mr-1" />
                          Publicado
                        </Badge>
                      )}
                      {content.platforms?.map((platform: string) => (
                        <span
                          key={platform}
                          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              
              {contents.filter(content => new Date(content.scheduledDate) > new Date()).length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    Nenhuma publicação agendada para os próximos dias.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
