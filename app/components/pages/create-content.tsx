
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { FileImage, Upload, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function CreateContentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caption: '',
    contentType: '',
    platforms: [] as string[],
    scheduledDate: '',
    assigneeId: ''
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Conteúdo criado com sucesso!",
          description: "O conteúdo foi salvo e enviado para aprovação.",
        })
        router.push('/dashboard/agency/contents')
      } else {
        const error = await response.json()
        toast({
          title: "Erro ao criar conteúdo",
          description: error.message || "Erro interno do servidor",
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

  return (
    <DashboardLayout
      title="Criar Novo Conteúdo"
      description="Crie um novo conteúdo para aprovação do cliente"
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
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Preencha as informações principais do conteúdo
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
                Selecione o tipo de conteúdo e onde será publicado
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
                Faça upload das imagens, vídeos ou outros arquivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  Arraste e solte seus arquivos aqui ou clique para selecionar
                </p>
                <Button variant="outline" type="button">
                  Selecionar Arquivos
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Programação</CardTitle>
              <CardDescription>
                Configure quando o conteúdo deve ser publicado
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
                <Select value={formData.assigneeId} onValueChange={(value) => handleInputChange('assigneeId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client1">Cliente A</SelectItem>
                    <SelectItem value="client2">Cliente B</SelectItem>
                    <SelectItem value="client3">Cliente C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/dashboard/agency/contents">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading || !formData.title || !formData.contentType || formData.platforms.length === 0}>
              {loading ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Criar Conteúdo
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
