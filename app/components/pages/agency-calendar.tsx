
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
  Plus,
  Clock,
  User
} from 'lucide-react'

export function AgencyCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [contents, setContents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'month' | 'week'>('month')

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
      'DRAFT': 'bg-gray-200 text-gray-800',
      'PENDING_APPROVAL': 'bg-yellow-200 text-yellow-800',
      'APPROVED': 'bg-green-200 text-green-800',
      'REVISION_REQUESTED': 'bg-red-200 text-red-800',
      'REJECTED': 'bg-red-200 text-red-800',
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
      <DashboardLayout title="Calendário" description="Visualize as publicações agendadas">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Calendário de Publicações"
      description="Visualize e gerencie todas as publicações agendadas"
    >
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
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
          
          <div className="flex gap-2">
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              onClick={() => setView('month')}
              size="sm"
            >
              Mês
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              onClick={() => setView('week')}
              size="sm"
            >
              Semana
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

        {/* Upcoming Publications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Próximas Publicações
            </CardTitle>
            <CardDescription>
              Conteúdos agendados para os próximos dias
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
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {content.assignee?.name || 'Sem cliente'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={content.status === 'APPROVED' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {content.status === 'APPROVED' ? 'Pronto' : 'Pendente'}
                      </Badge>
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
