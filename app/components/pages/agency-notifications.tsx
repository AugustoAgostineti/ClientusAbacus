
'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  BellOff,
  Check,
  CheckCheck,
  Clock,
  FileImage,
  User,
  AlertCircle,
  MessageSquare,
  Share2
} from 'lucide-react'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  sender?: {
    id: string
    name: string
    role: string
  }
  content?: {
    id: string
    title: string
    status: string
  }
}

export function AgencyNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds,
          read: true
        }),
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notificationIds.includes(notif.id) 
              ? { ...notif, read: true }
              : notif
          )
        )
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
    if (unreadIds.length > 0) {
      markAsRead(unreadIds)
    }
  }

  const getNotificationIcon = (type: string) => {
    const icons = {
      'CONTENT_CREATED': FileImage,
      'APPROVAL_REQUESTED': Clock,
      'CONTENT_APPROVED': Check,
      'REVISION_REQUESTED': AlertCircle,
      'CONTENT_REJECTED': AlertCircle,
      'CONTENT_PUBLISHED': Share2
    }
    return icons[type as keyof typeof icons] || Bell
  }

  const getNotificationColor = (type: string) => {
    const colors = {
      'CONTENT_CREATED': 'text-blue-600',
      'APPROVAL_REQUESTED': 'text-yellow-600',
      'CONTENT_APPROVED': 'text-green-600',
      'REVISION_REQUESTED': 'text-red-600',
      'CONTENT_REJECTED': 'text-red-600',
      'CONTENT_PUBLISHED': 'text-purple-600'
    }
    return colors[type as keyof typeof colors] || 'text-gray-600'
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <DashboardLayout title="Notificações" description="Visualize suas notificações">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={`Notificações ${unreadCount > 0 ? `(${unreadCount})` : ''}`}
      description="Acompanhe todas as atualizações e atividades"
    >
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-600">
              {unreadCount} não lidas de {notifications.length} total
            </span>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar Todas como Lidas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BellOff className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-gray-500">
                Você não tem notificações no momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type)
              const iconColor = getNotificationColor(notification.type)
              
              return (
                <Card 
                  key={notification.id} 
                  className={`hover:shadow-md transition-shadow cursor-pointer ${
                    !notification.read ? 'ring-2 ring-blue-100 bg-blue-50/50' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead([notification.id])}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleString('pt-BR')}
                            </span>
                          </div>
                        </div>
                        
                        <p className={`text-sm mb-2 ${
                          !notification.read ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {notification.sender && (
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {notification.sender.name}
                              </div>
                            )}
                            {notification.content && (
                              <div className="flex items-center">
                                <FileImage className="h-3 w-3 mr-1" />
                                {notification.content.title}
                              </div>
                            )}
                          </div>
                          
                          {notification.content && (
                            <Link href={`/dashboard/agency/contents/${notification.content.id}`}>
                              <Button variant="ghost" size="sm" className="text-xs">
                                Ver Conteúdo
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Configurações de Notificação
            </CardTitle>
            <CardDescription>
              Configure quando e como você deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Aprovações de Conteúdo</p>
                  <p className="text-sm text-gray-500">
                    Quando um cliente aprova ou rejeita um conteúdo
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novos Comentários</p>
                  <p className="text-sm text-gray-500">
                    Quando alguém comenta em um conteúdo
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Solicitações de Revisão</p>
                  <p className="text-sm text-gray-500">
                    Quando um cliente solicita alterações
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lembretes de Publicação</p>
                  <p className="text-sm text-gray-500">
                    Lembrar sobre conteúdos agendados para publicação
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
