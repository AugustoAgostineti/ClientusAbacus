
'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  Calendar,
  User
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Content {
  id: string
  title: string
  description?: string
  caption?: string
  contentType: string
  platforms: string[]
  mediaUrls: string[]
  thumbnailUrl?: string
  status: string
  scheduledDate?: string
  createdAt: string
  creator: {
    name: string
  }
  comments: any[]
  approvals: any[]
}

export function ClientApprovalsPage() {
  const { toast } = useToast()
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({})
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/contents?status=PENDING_APPROVAL')
      if (response.ok) {
        const data = await response.json()
        setContents(data)
      }
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (contentId: string, approved: boolean) => {
    setSubmitting(prev => ({ ...prev, [contentId]: true }))
    
    try {
      const response = await fetch('/api/approvals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          approved,
          feedback: feedback[contentId] || null
        }),
      })

      if (response.ok) {
        toast({
          title: approved ? "Conteúdo aprovado!" : "Feedback enviado!",
          description: approved 
            ? "O conteúdo foi aprovado com sucesso."
            : "Suas solicitações de alteração foram enviadas.",
        })
        
        // Remove from list or refresh
        setContents(prev => prev.filter(c => c.id !== contentId))
        setFeedback(prev => ({ ...prev, [contentId]: '' }))
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.message || "Erro ao processar aprovação",
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

  const getPlatformBadge = (platform: string) => {
    const colors = {
      'INSTAGRAM': 'bg-pink-100 text-pink-800',
      'FACEBOOK': 'bg-blue-100 text-blue-800',
      'TIKTOK': 'bg-black text-white',
      'YOUTUBE': 'bg-red-100 text-red-800'
    }
    
    return colors[platform as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <DashboardLayout title="Aprovações" description="Aprove ou solicite alterações">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Aprovações Pendentes"
      description="Revise e aprove os conteúdos criados para suas redes sociais"
    >
      <div className="space-y-6">
        {contents.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-250">
            <div className="p-8 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-[#B4F461] mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma aprovação pendente
              </h3>
              <p className="text-gray-500">
                Todos os conteúdos foram revisados. Novos conteúdos aparecerão aqui.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {contents.map((content) => (
              <div key={content.id} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-250 ease-out overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {content.title}
                      </h2>
                      {content.description && (
                        <p className="text-base text-gray-600 mb-3">
                          {content.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-[#5C7CFA]" />
                          Criado por {content.creator.name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-[#5C7CFA]" />
                          {new Date(content.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                        {content.scheduledDate && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-[#5C7CFA]" />
                            Agendado: {new Date(content.scheduledDate).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {content.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-[#D8C8F7] to-[#E8D8FF] text-[#5C7CFA] border border-white/40 backdrop-blur-sm"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-6">
                  {/* Media Preview */}
                  {content.mediaUrls && content.mediaUrls.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 text-gray-900">Mídia</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {content.mediaUrls.slice(0, 6).map((url, index) => (
                          <div key={index} className="relative aspect-square bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl overflow-hidden">
                            <Image
                              src={url}
                              alt={`Mídia ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        {content.mediaUrls.length > 6 && (
                          <div className="aspect-square bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl flex items-center justify-center text-gray-500 font-medium">
                            +{content.mediaUrls.length - 6} mais
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Caption */}
                  {content.caption && (
                    <div>
                      <h4 className="font-medium mb-2 text-gray-900">Legenda</h4>
                      <div className="bg-white/50 backdrop-blur-sm border border-white/40 p-4 rounded-xl">
                        <p className="whitespace-pre-wrap text-gray-700">{content.caption}</p>
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  {content.comments && content.comments.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center text-gray-900">
                        <MessageSquare className="h-4 w-4 mr-2 text-[#5C7CFA]" />
                        Comentários ({content.comments.length})
                      </h4>
                      <div className="space-y-3">
                        {content.comments.slice(0, 3).map((comment: any) => (
                          <div key={comment.id} className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-900">
                                {comment.author.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">{comment.message}</p>
                          </div>
                        ))}
                        {content.comments.length > 3 && (
                          <p className="text-sm text-gray-500 font-medium">
                            +{content.comments.length - 3} comentários...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Feedback Section */}
                  <div className="border-t border-white/40 pt-6">
                    <h4 className="font-medium mb-3 text-gray-900">Feedback e Aprovação</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comentários ou solicitações de alteração (opcional)
                        </label>
                        <Textarea
                          value={feedback[content.id] || ''}
                          onChange={(e) => setFeedback(prev => ({
                            ...prev,
                            [content.id]: e.target.value
                          }))}
                          placeholder="Descreva as alterações que gostaria de solicitar..."
                          rows={4}
                          className="bg-white/70 backdrop-blur-md border-white/40 rounded-xl focus:ring-2 focus:ring-[#5C7CFA]/50 focus:border-[#5C7CFA]/50 transition-all duration-250"
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproval(content.id, false)}
                          disabled={submitting[content.id]}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white border border-white/40 hover:from-red-600 hover:to-red-700 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(239,68,68,0.25)] active:scale-[0.98] shadow-[0_4px_16px_rgba(239,68,68,0.15)] backdrop-blur-md transition-all duration-250 ease-out disabled:opacity-50 disabled:scale-100"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          {submitting[content.id] ? 'Enviando...' : 'Solicitar Alterações'}
                        </button>
                        
                        <button
                          onClick={() => handleApproval(content.id, true)}
                          disabled={submitting[content.id]}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl bg-gradient-to-r from-[#B4F461] to-[#C4F581] text-[#374151] border border-white/40 hover:from-[#A4E441] hover:to-[#B4F471] hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(180,244,97,0.25)] active:scale-[0.98] shadow-[0_4px_16px_rgba(180,244,97,0.15)] backdrop-blur-md transition-all duration-250 ease-out disabled:opacity-50 disabled:scale-100"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {submitting[content.id] ? 'Aprovando...' : 'Aprovar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


      </div>
    </DashboardLayout>
  )
}
