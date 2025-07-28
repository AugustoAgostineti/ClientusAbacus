
'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  MessageSquare, 
  Search, 
  User,
  Clock,
  FileImage,
  Send,
  Reply
} from 'lucide-react'
import Link from 'next/link'

export function ClientCommentsPage() {
  const { toast } = useToast()
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({})
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      // Fetch contents with comments for this client
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

  const handleReply = async (contentId: string) => {
    const message = replyText[contentId]
    if (!message?.trim()) return

    setSubmitting(prev => ({ ...prev, [contentId]: true }))
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          message
        }),
      })

      if (response.ok) {
        toast({
          title: "Comentário enviado!",
          description: "Seu comentário foi adicionado com sucesso.",
        })
        
        setReplyText(prev => ({ ...prev, [contentId]: '' }))
        fetchComments() // Refresh comments
      } else {
        toast({
          title: "Erro ao enviar comentário",
          description: "Tente novamente mais tarde",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro no servidor",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setSubmitting(prev => ({ ...prev, [contentId]: false }))
    }
  }

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

  const filteredComments = comments.filter(comment =>
    comment.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.content.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group comments by content
  const commentsByContent = filteredComments.reduce((acc, comment) => {
    const contentId = comment.content.id
    if (!acc[contentId]) {
      acc[contentId] = {
        content: comment.content,
        comments: []
      }
    }
    acc[contentId].comments.push(comment)
    return acc
  }, {} as any)

  if (loading) {
    return (
      <DashboardLayout title="Comentários" description="Visualize e responda comentários">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Comentários"
      description="Visualize e responda aos comentários dos seus conteúdos"
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

        {/* Comments by Content */}
        {Object.keys(commentsByContent).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum comentário encontrado
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Tente ajustar o termo de busca.'
                  : 'Os comentários dos seus conteúdos aparecerão aqui.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(commentsByContent).map(([contentId, data]: [string, any]) => (
              <Card key={contentId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileImage className="h-5 w-5 text-blue-600" />
                        {data.content.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {data.comments.length} comentário{data.comments.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <Link href={`/dashboard/client/approvals`}>
                      <Button variant="outline" size="sm">
                        Ver Conteúdo
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Comments Thread */}
                  <div className="space-y-4">
                    {data.comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {comment.author.name}
                            </span>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getRoleColor(comment.author.role)}`}
                            >
                              {getRoleLabel(comment.author.role)}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {comment.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Reply Form */}
                  <div className="border-t pt-4">
                    <div className="space-y-3">
                      <Textarea
                        value={replyText[contentId] || ''}
                        onChange={(e) => setReplyText(prev => ({
                          ...prev,
                          [contentId]: e.target.value
                        }))}
                        placeholder="Adicione um comentário..."
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleReply(contentId)}
                          disabled={submitting[contentId] || !replyText[contentId]?.trim()}
                          size="sm"
                        >
                          {submitting[contentId] ? (
                            <>Enviando...</>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Comentar
                            </>
                          )}
                        </Button>
                      </div>
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
                  {Object.keys(commentsByContent).length}
                </div>
                <div className="text-sm text-gray-600">Conteúdos com Comentários</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {comments.filter(c => c.author.role === 'CLIENT').length}
                </div>
                <div className="text-sm text-gray-600">Seus Comentários</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
