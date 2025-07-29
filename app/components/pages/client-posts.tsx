

'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { 
  Download,
  Search,
  Filter,
  Calendar,
  User,
  ImageIcon,
  Video,
  Images,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Share2,
  MessageSquare,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Post {
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
  updatedAt: string
  creator: {
    id: string
    name: string
    email: string
    role: string
  }
  assignee: {
    id: string
    name: string
    email: string
    companyName?: string
  }
  latestApproval: any
  recentComments: any[]
  stats: {
    totalComments: number
    totalApprovals: number
  }
  statusInfo: {
    label: string
    color: string
    icon: string
  }
  mediaType: {
    type: string
    label: string
    icon: string
  }
  mediaCount: number
}

interface PostsResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
}

const STATUS_FILTERS = [
  { value: 'ALL', label: 'Todos os Status' },
  { value: 'PENDING_APPROVAL', label: 'Aguardando Aprovação' },
  { value: 'APPROVED', label: 'Aprovado' },
  { value: 'REJECTED', label: 'Alterações Solicitadas' },
  { value: 'SCHEDULED', label: 'Agendado' },
  { value: 'PUBLISHED', label: 'Publicado' }
]

const PLATFORM_FILTERS = [
  { value: 'ALL', label: 'Todas as Plataformas' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'YOUTUBE', label: 'YouTube' }
]

export function ClientPostsPage() {
  const { toast } = useToast()
  const [postsData, setPostsData] = useState<PostsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<{ [key: string]: boolean }>({})
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [platformFilter, setPlatformFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchPosts()
  }, [statusFilter, platformFilter, currentPage])

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      })

      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter)
      }

      if (platformFilter !== 'ALL') {
        params.append('platform', platformFilter)
      }

      const response = await fetch(`/api/posts/client?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPostsData(data)
      } else {
        throw new Error('Failed to fetch posts')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        title: "Erro ao carregar posts",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (postId: string, type: string = 'single', index?: number) => {
    setDownloading(prev => ({ ...prev, [postId]: true }))
    
    try {
      const params = new URLSearchParams({ type })
      if (index !== undefined) {
        params.append('index', index.toString())
      }

      const response = await fetch(`/api/download/${postId}?${params}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const contentDisposition = response.headers.get('content-disposition')
        const filename = contentDisposition 
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : `download_${postId}`
        
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        
        toast({
          title: "Download iniciado!",
          description: "O arquivo está sendo baixado.",
        })
      } else {
        throw new Error('Download failed')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Erro no download",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setDownloading(prev => ({ ...prev, [postId]: false }))
    }
  }

  const getStatusBadge = (statusInfo: any) => {
    const colorMap = {
      'gray': 'bg-gray-100 text-gray-800 border-gray-200',
      'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'green': 'bg-green-100 text-green-800 border-green-200',
      'red': 'bg-red-100 text-red-800 border-red-200',
      'blue': 'bg-blue-100 text-blue-800 border-blue-200',
      'purple': 'bg-purple-100 text-purple-800 border-purple-200'
    }
    
    return colorMap[statusInfo.color as keyof typeof colorMap] || colorMap.gray
  }

  const getMediaIcon = (mediaType: any) => {
    const icons = {
      'text': FileText,
      'image': ImageIcon,
      'video': Video,
      'carousel': Images
    }
    return icons[mediaType.type as keyof typeof icons] || FileText
  }

  const filteredPosts = postsData?.posts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (loading) {
    return (
      <DashboardLayout title="Posts" description="Visualize e baixe seus posts">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Meus Posts"
      description="Visualize todos os seus posts e baixe os arquivos de mídia"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        {postsData?.stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-250">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {postsData.stats.total}
                  </p>
                  <p className="text-sm text-gray-600">Total de Posts</p>
                </div>
                <FileText className="h-8 w-8 text-[#5C7CFA]" />
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-250">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#B4F461]">
                    {postsData.stats.approved}
                  </p>
                  <p className="text-sm text-gray-600">Aprovados</p>
                </div>
                <CheckCircle className="h-8 w-8 text-[#B4F461]" />
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-250">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-500">
                    {postsData.stats.pending}
                  </p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-250">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-500">
                    {postsData.stats.rejected}
                  </p>
                  <p className="text-sm text-gray-600">Alterações</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/70 backdrop-blur-md border-white/40 rounded-xl focus:ring-2 focus:ring-[#5C7CFA]/50"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-white/70 backdrop-blur-md border-white/40 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-48 bg-white/70 backdrop-blur-md border-white/40 rounded-xl">
                  <SelectValue placeholder="Plataforma" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_FILTERS.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-250">
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum post encontrado
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Tente ajustar os filtros ou termo de busca.'
                  : 'Seus posts aparecerão aqui quando forem criados.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const MediaIcon = getMediaIcon(post.mediaType)
              return (
                <div key={post.id} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-250 ease-out overflow-hidden">
                  {/* Media Preview */}
                  <div className="relative aspect-square bg-white/50 backdrop-blur-sm border-b border-white/40">
                    {post.mediaUrls && post.mediaUrls.length > 0 ? (
                      <div className="relative h-full">
                        <Image
                          src={post.thumbnailUrl || post.mediaUrls[0]}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                        {post.mediaCount > 1 && (
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
                            +{post.mediaCount - 1}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <MediaIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Download Button Overlay */}
                    <div className="absolute top-2 left-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(post.id)}
                        disabled={downloading[post.id]}
                        className="bg-white/90 backdrop-blur-md border-white/40 hover:bg-white hover:scale-[1.05] transition-all duration-250 text-gray-900"
                      >
                        {downloading[post.id] ? (
                          <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-gray-600 rounded-full" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(post.statusInfo)}`}>
                        {post.statusInfo.label}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <MediaIcon className="h-3 w-3 mr-1" />
                        {post.mediaType.label}
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {post.description}
                        </p>
                      )}
                    </div>

                    {/* Platforms */}
                    <div className="flex flex-wrap gap-1">
                      {post.platforms.slice(0, 3).map((platform) => (
                        <span
                          key={platform}
                          className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-[#D8C8F7] to-[#E8D8FF] text-[#5C7CFA] border border-white/40"
                        >
                          {platform}
                        </span>
                      ))}
                      {post.platforms.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          +{post.platforms.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/40">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {post.stats.totalComments}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      
                      <Link href={`/dashboard/client/approvals`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#5C7CFA] hover:bg-[#5C7CFA]/10 hover:scale-[1.05] transition-all duration-250"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {postsData?.pagination && postsData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!postsData.pagination.hasPrev}
              className="bg-white/70 backdrop-blur-md border-white/40 hover:bg-white/80 transition-all duration-250"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="px-4 py-2 text-sm font-medium bg-white/70 backdrop-blur-md border border-white/40 rounded-xl">
              {postsData.pagination.page} de {postsData.pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!postsData.pagination.hasNext}
              className="bg-white/70 backdrop-blur-md border-white/40 hover:bg-white/80 transition-all duration-250"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
