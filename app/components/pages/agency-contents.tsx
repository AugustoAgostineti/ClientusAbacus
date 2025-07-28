
'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileImage, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
    id: string
    name: string
  }
  assignee?: {
    id: string
    name: string
    companyName?: string
  }
}

export function AgencyContentsPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')

  useEffect(() => {
    fetchContents()
  }, [statusFilter, platformFilter])

  const fetchContents = async () => {
    try {
      let url = '/api/contents?'
      if (statusFilter !== 'all') url += `status=${statusFilter}&`
      if (platformFilter !== 'all') url += `platform=${platformFilter}&`
      
      const response = await fetch(url)
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'DRAFT': { label: 'Rascunho', variant: 'secondary' as const },
      'PENDING_APPROVAL': { label: 'Pendente', variant: 'secondary' as const },
      'APPROVED': { label: 'Aprovado', variant: 'default' as const },
      'REVISION_REQUESTED': { label: 'Revisão', variant: 'destructive' as const },
      'REJECTED': { label: 'Rejeitado', variant: 'destructive' as const },
      'PUBLISHED': { label: 'Publicado', variant: 'default' as const }
    }
    
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const }
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

  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.assignee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout title="Conteúdos" description="Gerencie todos os conteúdos criados">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Conteúdos"
      description="Gerencie todos os conteúdos criados para seus clientes"
    >
      <div className="space-y-6">
        {/* Actions and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Link href="/dashboard/agency/contents/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Novo Conteúdo
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar conteúdos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="DRAFT">Rascunho</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pendente</SelectItem>
                <SelectItem value="APPROVED">Aprovado</SelectItem>
                <SelectItem value="REVISION_REQUESTED">Revisão</SelectItem>
                <SelectItem value="REJECTED">Rejeitado</SelectItem>
                <SelectItem value="PUBLISHED">Publicado</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                <SelectItem value="FACEBOOK">Facebook</SelectItem>
                <SelectItem value="TIKTOK">TikTok</SelectItem>
                <SelectItem value="YOUTUBE">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Grid */}
        {filteredContents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum conteúdo encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || platformFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece criando seu primeiro conteúdo.'}
              </p>
              {!searchTerm && statusFilter === 'all' && platformFilter === 'all' && (
                <Link href="/dashboard/agency/contents/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Conteúdo
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContents.map((content) => {
              const status = getStatusBadge(content.status)
              return (
                <Card key={content.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={status.variant} className="text-xs">
                        {status.label}
                      </Badge>
                      <div className="flex gap-1">
                        {content.platforms?.map((platform) => (
                          <span
                            key={platform}
                            className={`px-2 py-1 text-xs rounded-full ${getPlatformBadge(platform)}`}
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {content.thumbnailUrl && (
                      <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden mb-3">
                        <Image
                          src={content.thumbnailUrl}
                          alt={content.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <CardTitle className="text-lg line-clamp-2">
                      {content.title}
                    </CardTitle>
                    {content.description && (
                      <CardDescription className="line-clamp-2">
                        {content.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>Cliente: {content.assignee?.name || 'Sem cliente'}</span>
                      </div>
                      {content.scheduledDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            Agendado: {new Date(content.scheduledDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/dashboard/agency/contents/${content.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
