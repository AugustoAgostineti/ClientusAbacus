

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { MediaUpload } from '@/components/ui/media-upload'
import { useToast } from '@/hooks/use-toast'
import { FileImage, Upload, Save, ArrowLeft, Users, Loader2, Edit } from 'lucide-react'
import Link from 'next/link'

interface Client {
  id: string
  name: string
  email: string
  companyName?: string
}

interface UploadedFile {
  name: string
  size: number
  type: string
  url: string
  isImage: boolean
  isVideo: boolean
}

interface EditContentProps {
  contentId: string
}

export function EditContentPage({ contentId }: EditContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingClients, setLoadingClients] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caption: '',
    contentType: '',
    platforms: [] as string[],
    scheduledDate: '',
    assigneeId: ''
  })

  // Fetch content data and clients on component mount
  useEffect(() => {
    Promise.all([fetchContent(), fetchClients()])
  }, [contentId])

  const fetchContent = async () => {
    console.log('🔄 EDIT-CONTENT: Starting fetchContent for ID:', contentId)
    try {
      setLoadingContent(true)
      const response = await fetch(`/api/contents/${contentId}`)
      console.log('📡 EDIT-CONTENT: Response status:', response.status)
      
      if (response.ok) {
        const content = await response.json()
        console.log('✅ EDIT-CONTENT: Content data received:', content)
        
        // Pre-populate form with existing data
        setFormData({
          title: content.title || '',
          description: content.description || '',
          caption: content.caption || '',
          contentType: content.contentType || '',
          platforms: content.platforms || [],
          scheduledDate: content.scheduledDate ? 
            new Date(content.scheduledDate).toISOString().slice(0, 16) : '',
          assigneeId: content.assigneeId || ''
        })

        // Convert existing mediaUrls to UploadedFile format
        if (content.mediaUrls && content.mediaUrls.length > 0) {
          const existingFiles: UploadedFile[] = content.mediaUrls.map((url: string, index: number) => {
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
            const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(url)
            
            return {
              name: `existing-file-${index + 1}.${isImage ? 'jpg' : isVideo ? 'mp4' : 'file'}`,
              size: 0, // Size unknown for existing files
              type: isImage ? 'image/jpeg' : isVideo ? 'video/mp4' : 'application/octet-stream',
              url: url,
              isImage: isImage,
              isVideo: isVideo
            }
          })
          setUploadedFiles(existingFiles)
        }
        
        console.log('✅ EDIT-CONTENT: Form populated with existing data')
      } else {
        console.error('❌ EDIT-CONTENT: Failed to fetch content:', response.status)
        toast({
          title: "Erro",
          description: "Não foi possível carregar o conteúdo para edição",
          variant: "destructive",
        })
        router.push('/dashboard/agency/contents')
      }
    } catch (error) {
      console.error('❌ EDIT-CONTENT: Fetch content error:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar conteúdo",
        variant: "destructive",
      })
      router.push('/dashboard/agency/contents')
    } finally {
      setLoadingContent(false)
    }
  }

  const fetchClients = async () => {
    console.log('🔄 EDIT-CONTENT: Starting fetchClients...')
    try {
      setLoadingClients(true)
      const response = await fetch('/api/users?role=CLIENT')
      console.log('📡 EDIT-CONTENT: Clients response status:', response.status)
      
      if (response.ok) {
        const clientUsers = await response.json()
        console.log('✅ EDIT-CONTENT: Clients data received:', clientUsers.length, 'clients')
        setClients(clientUsers)
      } else {
        console.error('❌ EDIT-CONTENT: Failed to fetch clients:', response.status)
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de clientes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('❌ EDIT-CONTENT: Fetch clients error:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive",
      })
    } finally {
      setLoadingClients(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      platforms: checked
        ? [...prev.platforms, platform]
        : prev.platforms.filter(p => p !== platform)
    }))
  }

  const handleFilesUploaded = (newFiles: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare media URLs from uploaded files
      const mediaUrls = uploadedFiles.map(file => file.url)

      const contentData = {
        ...formData,
        mediaUrls,
        thumbnailUrl: uploadedFiles.find(f => f.isImage)?.url || null
      }

      console.log('🚀 EDIT-CONTENT: Submitting update with data:', contentData)

      const response = await fetch(`/api/contents/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      })

      if (response.ok) {
        const updatedContent = await response.json()
        console.log('✅ EDIT-CONTENT: Content updated successfully:', updatedContent.id)
        
        toast({
          title: "Conteúdo atualizado com sucesso!",
          description: "As alterações foram salvas.",
        })
        router.push('/dashboard/agency/contents')
      } else {
        const error = await response.json()
        console.error('❌ EDIT-CONTENT: Update failed:', error)
        
        if (response.status === 401) {
          toast({
            title: "Sessão expirada",
            description: "Faça login novamente para continuar.",
            variant: "destructive",
          })
          router.push('/auth/signin')
        } else if (response.status === 403) {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para editar este conteúdo.",
            variant: "destructive",
          })
        } else if (response.status === 400) {
          toast({
            title: "Dados inválidos",
            description: error.error || "Verifique os dados informados.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Erro ao atualizar conteúdo",
            description: error.error || "Erro interno do servidor",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error('❌ EDIT-CONTENT: Network or parsing error:', error)
      toast({
        title: "Erro de conexão",
        description: "Verifique sua conexão com a internet e tente novamente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingContent) {
    return (
      <DashboardLayout
        title="Carregando..."
        description="Carregando dados do conteúdo"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <div>Carregando conteúdo...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Editar Conteúdo"
      description="Modifique as informações, mídia e configurações do conteúdo"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/agency/contents">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Conteúdos
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit className="mr-2 h-5 w-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Edite as informações principais do conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Digite o título do conteúdo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva o conteúdo (opcional)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="caption">Legenda</Label>
                <Textarea
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => handleInputChange('caption', e.target.value)}
                  placeholder="Digite a legenda para as redes sociais"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipo e Plataformas</CardTitle>
              <CardDescription>
                Altere o tipo de conteúdo e onde será publicado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contentType">Tipo de Conteúdo *</Label>
                <Select value={formData.contentType} onValueChange={(value) => handleInputChange('contentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IMAGE">Imagem</SelectItem>
                    <SelectItem value="CAROUSEL">Carrossel</SelectItem>
                    <SelectItem value="VIDEO">Vídeo</SelectItem>
                    <SelectItem value="STORY">Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Plataformas *</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {['INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'YOUTUBE'].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform}
                        checked={formData.platforms.includes(platform)}
                        onCheckedChange={(checked) =>
                          handlePlatformChange(platform, checked as boolean)
                        }
                      />
                      <Label htmlFor={platform}>{platform}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mídia</CardTitle>
              <CardDescription>
                Adicione, remova ou substitua arquivos de mídia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaUpload
                onFilesUploaded={handleFilesUploaded}
                uploadedFiles={uploadedFiles}
                onRemoveFile={handleRemoveFile}
                maxFiles={10}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Programação e Cliente</CardTitle>
              <CardDescription>
                Altere quando o conteúdo deve ser publicado e para qual cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="scheduledDate">Data de Publicação</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="assigneeId">Cliente *</Label>
                {loadingClients ? (
                  <div className="flex items-center space-x-2 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Carregando clientes...</span>
                  </div>
                ) : (
                  <Select value={formData.assigneeId} onValueChange={(value) => handleInputChange('assigneeId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.length === 0 ? (
                        <div className="px-2 py-1 text-sm text-gray-500">
                          Nenhum cliente encontrado
                        </div>
                      ) : (
                        clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{client.name}</div>
                                {client.companyName && (
                                  <div className="text-xs text-gray-500">{client.companyName}</div>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/dashboard/agency/contents">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={
                loading || 
                !formData.title || 
                !formData.contentType || 
                formData.platforms.length === 0 ||
                !formData.assigneeId
              }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
