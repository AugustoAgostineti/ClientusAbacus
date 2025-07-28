
'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Share2,
  History
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ContentHistory } from './content-history'

interface ContentDetailProps {
  contentId: string
}

export function ContentDetailPage({ contentId }: ContentDetailProps) {
  const { toast } = useToast()
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [contentId])

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/contents/${contentId}`)
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      } else {
        toast({
          title: "Erro ao carregar conteúdo",
          description: "Conteúdo não encontrado",
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
      setLoading(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setSubmittingComment(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          message: commentText
        }),
      })

      if (response.ok) {
        setCommentText('')
        fetchContent() // Refresh to get updated comments
        toast({
          title: "Comentário adicionado",
          description: "Seu comentário foi enviado com sucesso.",
        })
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
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!content) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Conteúdo não encontrado</h2>
          <Link href="/dashboard/agency/contents">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Conteúdos
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'DRAFT': { label: 'Rascunho', variant: 'secondary' as const, icon: Edit },
      'PENDING_APPROVAL': { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
      'APPROVED': { label: 'Aprovado', variant: 'default' as const, icon: CheckCircle },
      'REVISION_REQUESTED': { label: 'Revisão', variant: 'destructive' as const, icon: XCircle },
      'REJECTED': { label: 'Rejeitado', variant: 'destructive' as const, icon: XCircle },
      'PUBLISHED': { label: 'Publicado', variant: 'default' as const, icon: Share2 }
    }
    
    return statusMap[status as keyof typeof statusMap] || { 
      label: status, 
      variant: 'secondary' as const, 
      icon: Clock 
    }
  }

  const status = getStatusBadge(content.status)
  const StatusIcon = status.icon

  return (
    <DashboardLayout
      title={showHistory ? `Histórico - ${content.title}` : content.title}
      description={showHistory ? "Visualize o histórico de alterações do conteúdo" : "Visualize e gerencie os detalhes do conteúdo"}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/agency/contents">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Conteúdos
            </Button>
          </Link>
        </div>

        {showHistory ? (
          <ContentHistory 
            contentId={contentId}
            onBack={() => setShowHistory(false)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-5 w-5" />
                    <Badge variant={status.variant}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
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
                <CardTitle className="text-2xl">{content.title}</CardTitle>
                {content.description && (
                  <CardDescription className="text-base">
                    {content.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Media Preview */}
                {content.mediaUrls && content.mediaUrls.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Mídia</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.mediaUrls.map((url: string, index: number) => (
                        <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={url}
                            alt={`Mídia ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Caption */}
                {content.caption && (
                  <div>
                    <h4 className="font-medium mb-2">Legenda</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{content.caption}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Comentários ({content.comments?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="space-y-2">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Adicione um comentário..."
                    rows={3}
                  />
                  <Button 
                    type="submit" 
                    disabled={submittingComment || !commentText.trim()}
                    size="sm"
                  >
                    {submittingComment ? 'Enviando...' : 'Adicionar Comentário'}
                  </Button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {content.comments?.length > 0 ? (
                    content.comments.map((comment: any) => (
                      <div key={comment.id} className="border-l-2 border-blue-200 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {comment.author.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      Nenhum comentário ainda.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Content Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">Cliente</p>
                    <p className="text-gray-600">
                      {content.assignee?.name || 'Não atribuído'}
                    </p>
                    {content.assignee?.companyName && (
                      <p className="text-xs text-gray-500">
                        {content.assignee.companyName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">Criado por</p>
                    <p className="text-gray-600">{content.creator.name}</p>
                  </div>
                </div>

                {content.scheduledDate && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <p className="font-medium">Agendado para</p>
                      <p className="text-gray-600">
                        {new Date(content.scheduledDate).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">Criado em</p>
                    <p className="text-gray-600">
                      {new Date(content.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Approval History */}
            {content.approvals && content.approvals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Aprovações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {content.approvals.map((approval: any) => (
                    <div key={approval.id} className="text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">
                          {approval.approver.name}
                        </span>
                        <Badge 
                          variant={approval.approved ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {approval.approved ? 'Aprovado' : 'Rejeitado'}
                        </Badge>
                      </div>
                      {approval.feedback && (
                        <p className="text-gray-600 mb-1">{approval.feedback}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(approval.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="mr-2 h-4 w-4" />
                  {showHistory ? 'Ver Detalhes' : 'Ver Histórico'}
                </Button>
                <Link href={`/dashboard/agency/contents/${contentId}/edit`}>
                  <Button className="w-full" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Conteúdo
                  </Button>
                </Link>
                {content.status === 'APPROVED' && (
                  <Button className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Publicar Agora
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    </DashboardLayout>
  )
}
