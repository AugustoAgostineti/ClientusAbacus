

'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { FileImage, Upload, Save, ArrowLeft, Users, Loader2, Edit, AlertTriangle, RotateCcw, Info } from 'lucide-react'
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
  
  // Current form data (being edited)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caption: '',
    contentType: '',
    platforms: [] as string[],
    scheduledDate: '',
    assigneeId: '',
    changeReason: ''
  })

  // Original data from server (for comparison and reset)
  const [originalData, setOriginalData] = useState({
    title: '',
    description: '',
    caption: '',
    contentType: '',
    platforms: [] as string[],
    scheduledDate: '',
    assigneeId: '',
    changeReason: ''
  })

  // Original files from server
  const [originalFiles, setOriginalFiles] = useState<UploadedFile[]>([])

  // State for unsaved changes detection
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  // Function to detect changes between current and original data
  const detectChanges = useCallback(() => {
    const formChanged = JSON.stringify(formData) !== JSON.stringify(originalData)
    const filesChanged = JSON.stringify(uploadedFiles) !== JSON.stringify(originalFiles)
    return formChanged || filesChanged
  }, [formData, originalData, uploadedFiles, originalFiles])

  // Update hasUnsavedChanges whenever form data or files change
  useEffect(() => {
    setHasUnsavedChanges(detectChanges())
  }, [detectChanges])

  // Prevent navigation if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'Você tem alterações não salvas. Deseja sair mesmo assim?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

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
        
        // Prepare data objects
        const dataObject = {
          title: content.title || '',
          description: content.description || '',
          caption: content.caption || '',
          contentType: content.contentType || '',
          platforms: content.platforms || [],
          scheduledDate: content.scheduledDate ? 
            new Date(content.scheduledDate).toISOString().slice(0, 16) : '',
          assigneeId: content.assigneeId || '',
          changeReason: '' // Always empty for editing (not persisted in DB)
        }

        // Set both original and current form data (no changes initially)
        setOriginalData({ ...dataObject })
        setFormData({ ...dataObject })

        // Convert existing mediaUrls to UploadedFile format
        let existingFiles: UploadedFile[] = []
        if (content.mediaUrls && content.mediaUrls.length > 0) {
          existingFiles = content.mediaUrls.map((url: string, index: number) => {
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
        }

        // Set both original and current files (no changes initially)
        setOriginalFiles([...existingFiles])
        setUploadedFiles([...existingFiles])
        
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

  // Reset form to original data
  const handleResetToOriginal = () => {
    setFormData({ ...originalData })
    setUploadedFiles([...originalFiles])
    setHasUnsavedChanges(false)
    toast({
      title: "Alterações descartadas",
      description: "O formulário foi restaurado para os dados originais.",
    })
  }

  // Handle cancel with confirmation if there are unsaved changes
  const handleCancelWithConfirmation = () => {
    if (hasUnsavedChanges) {
      setShowCancelDialog(true)
    } else {
      router.push('/dashboard/agency/contents')
    }
  }

  // Confirm cancel and discard changes
  const handleConfirmCancel = () => {
    setShowCancelDialog(false)
    router.push('/dashboard/agency/contents')
  }

  // Handle navigation with unsaved changes check
  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path)
      setShowLeaveDialog(true)
    } else {
      router.push(path)
    }
  }

  // Confirm navigation and discard changes
  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation)
      setPendingNavigation(null)
    }
    setShowLeaveDialog(false)
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
        thumbnailUrl: uploadedFiles.find(f => f.isImage)?.url || null,
        changeReason: formData.changeReason || undefined // Only include if provided
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
        
        // Update original data to reflect saved changes
        setOriginalData({ ...formData })
        setOriginalFiles([...uploadedFiles])
        setHasUnsavedChanges(false)
        
        // Show appropriate success message based on status change
        let toastTitle = "Conteúdo atualizado com sucesso!"
        let toastDescription = "As alterações foram salvas."
        
        if (updatedContent.wasResentForApproval) {
          toastTitle = "Conteúdo atualizado e enviado para aprovação!"
          toastDescription = "As alterações foram salvas e o conteúdo foi automaticamente reenviado para aprovação do cliente."
        } else if (updatedContent.statusChanged && updatedContent.status === 'DRAFT') {
          toastDescription = "As alterações foram salvas. O conteúdo permanece como RASCUNHO pois não tem cliente atribuído."
        }
        
        toast({
          title: toastTitle,
          description: toastDescription,
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
      title={hasUnsavedChanges ? "Editar Conteúdo *" : "Editar Conteúdo"}
      description={hasUnsavedChanges ? "Modifique as informações, mídia e configurações do conteúdo (* alterações não salvas)" : "Modifique as informações, mídia e configurações do conteúdo"}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => handleNavigation('/dashboard/agency/contents')}
            type="button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Conteúdos
          </Button>
          
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-amber-600 font-medium">
                Alterações não salvas
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetToOriginal}
                type="button"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Restaurar
              </Button>
            </div>
          )}
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

              {/* Motivo da alteração (opcional) */}
              <div>
                <Label htmlFor="changeReason">Motivo da Alteração (Opcional)</Label>
                <Textarea
                  id="changeReason"
                  value={formData.changeReason}
                  onChange={(e) => handleInputChange('changeReason', e.target.value)}
                  placeholder="Descreva brevemente o motivo desta alteração (opcional)"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este motivo será registrado no histórico de alterações do conteúdo.
                </p>
              </div>
              
              {/* Aviso sobre reenvio para aprovação */}
              {formData.assigneeId && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800 mb-1">
                        Reenvio automático para aprovação
                      </p>
                      <p className="text-blue-700">
                        Como este conteúdo tem um cliente atribuído, após salvar as alterações ele será automaticamente 
                        enviado para aprovação. O cliente receberá uma nova solicitação de aprovação.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <div className="flex gap-2">
              {hasUnsavedChanges && (
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleResetToOriginal}
                  disabled={loading}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restaurar Original
                </Button>
              )}
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={handleCancelWithConfirmation}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={
                  loading || 
                  !formData.title || 
                  !formData.contentType || 
                  formData.platforms.length === 0 ||
                  !formData.assigneeId ||
                  !hasUnsavedChanges
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
                    {hasUnsavedChanges ? 'Salvar Alterações' : 'Sem Alterações'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Descartar alterações?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas neste conteúdo. Se continuar, todas as alterações serão perdidas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Continuar editando
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Sim, descartar alterações
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Navigation Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Sair sem salvar?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas. Se sair agora, todas as alterações serão perdidas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLeaveDialog(false)}>
              Continuar editando
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmNavigation}
              className="bg-red-600 hover:bg-red-700"
            >
              Sim, sair sem salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
