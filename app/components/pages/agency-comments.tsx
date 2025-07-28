
'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MessageSquare, 
  Search, 
  User,
  Clock,
  FileImage,
  Reply
} from 'lucide-react'
import Link from 'next/link'

export function AgencyCommentsPage() {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      // Fetch all contents with comments
      const response = await fetch('/api/contents')
      if (response.ok) {
        const contents = await response.json()
        const allComments = contents.flatMap((content: any) => 
          content.comments?.map((comment: any) => ({
            ...comment,
            content: {
              id: content.id,
              title: content.title,
              status: content.status
            }
          })) || []
        )
        setComments(allComments.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ))
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredComments = comments.filter(comment =>
    comment.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.content.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    const colors = {
      'ADMIN_AGENCY': 'bg-purple-100 text-purple-800',
      'EMPLOYEE_AGENCY': 'bg-blue-100 text-blue-800',
      'CLIENT': 'bg-green-100 text-green-800'
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      'ADMIN_AGENCY': 'Admin',
      'EMPLOYEE_AGENCY': 'Agência',
      'CLIENT': 'Cliente'
    }
    return labels[role as keyof typeof labels] || role
  }

  if (loading) {
    return (
      <DashboardLayout title="Comentários" description="Visualize todos os comentários">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Comentários"
      description="Visualize e gerencie todos os comentários dos conteúdos"
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar comentários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Comments List */}
        {filteredComments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum comentário encontrado
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Tente ajustar o termo de busca.'
                  : 'Os comentários dos conteúdos aparecerão aqui.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {comment.author.name}
                        </span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getRoleColor(comment.author.role)}`}
                        >
                          {getRoleLabel(comment.author.role)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(comment.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {comment.message}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <FileImage className="h-4 w-4 mr-2" />
                      <span>Conteúdo: </span>
                      <Link 
                        href={`/dashboard/agency/contents/${comment.content.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium ml-1"
                      >
                        {comment.content.title}
                      </Link>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                        Responder
                      </Button>
                      <Link href={`/dashboard/agency/contents/${comment.content.id}`}>
                        <Button variant="outline" size="sm">
                          Ver Conteúdo
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Comentários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {comments.length}
                </div>
                <div className="text-sm text-gray-600">Total de Comentários</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {comments.filter(c => c.author.role === 'CLIENT').length}
                </div>
                <div className="text-sm text-gray-600">De Clientes</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {comments.filter(c => 
                    new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </div>
                <div className="text-sm text-gray-600">Esta Semana</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
