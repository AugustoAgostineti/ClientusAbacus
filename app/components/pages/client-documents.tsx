
'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Upload, 
  Search, 
  Download,
  Eye,
  Plus,
  Calendar,
  User,
  File
} from 'lucide-react'

interface Document {
  id: string
  name: string
  fileUrl: string
  fileSize?: number
  mimeType?: string
  description?: string
  createdAt: string
  uploader: {
    id: string
    name: string
    role: string
  }
}

export function ClientDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      // This would be a real API call
      // For now, using mock data relevant to the client
      const mockDocuments: Document[] = [
        {
          id: '1',
          name: 'Briefing - Campanha Q1 2025',
          fileUrl: 'https://example.com/briefing-q1-2025.pdf',
          fileSize: 2048000,
          mimeType: 'application/pdf',
          description: 'Briefing completo da campanha do primeiro trimestre que enviei para a agência',
          createdAt: new Date().toISOString(),
          uploader: {
            id: '1',
            name: 'Você',
            role: 'CLIENT'
          }
        },
        {
          id: '2',
          name: 'Manual da Marca - Sua Empresa',
          fileUrl: 'https://example.com/manual-marca.pdf',
          fileSize: 5120000,
          mimeType: 'application/pdf',
          description: 'Diretrizes visuais e de comunicação da sua marca',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          uploader: {
            id: '2',
            name: 'Agência Creative',
            role: 'ADMIN_AGENCY'
          }
        },
        {
          id: '3',
          name: 'Imagens de Referência',
          fileUrl: 'https://example.com/referencias.zip',
          fileSize: 12800000,
          mimeType: 'application/zip',
          description: 'Imagens de referência para o estilo visual da campanha',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          uploader: {
            id: '1',
            name: 'Você',
            role: 'CLIENT'
          }
        }
      ]
      setDocuments(mockDocuments)
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Tamanho desconhecido'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return File
    if (mimeType.includes('pdf')) return FileText
    if (mimeType.includes('image')) return File
    if (mimeType.includes('video')) return File
    if (mimeType.includes('zip')) return File
    return File
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      'ADMIN_AGENCY': 'Agência',
      'EMPLOYEE_AGENCY': 'Agência',
      'CLIENT': 'Você'
    }
    return labels[role as keyof typeof labels] || role
  }

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.uploader.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout title="Documentos" description="Acesse seus documentos">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Documentos"
      description="Acesse e gerencie documentos importantes do projeto"
    >
      <div className="space-y-6">
        {/* Actions and Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="mr-2 h-4 w-4" />
            Enviar Documento
          </Button>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Upload Area */}
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8">
            <div className="text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Envie documentos para a agência
              </h3>
              <p className="text-gray-500 mb-4">
                Compartilhe briefings, referências e outros materiais importantes
              </p>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Selecionar Arquivos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum documento encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Tente ajustar o termo de busca.'
                  : 'Comece enviando seus primeiros documentos para a agência.'}
              </p>
              {!searchTerm && (
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Enviar Primeiro Documento
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => {
              const FileIcon = getFileIcon(document.mimeType)
              
              return (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <FileIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-2">
                          {document.name}
                        </CardTitle>
                        {document.description && (
                          <CardDescription className="line-clamp-2 mt-1">
                            {document.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center justify-between">
                        <span>Tamanho:</span>
                        <span>{formatFileSize(document.fileSize)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>
                          Enviado por {getRoleLabel(document.uploader.role)}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(document.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Document Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categorias de Documentos</CardTitle>
            <CardDescription>
              Organize seus documentos por tipo para fácil acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FileText className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="font-medium">Briefings</div>
                <div className="text-sm text-gray-600">
                  {documents.filter(doc => doc.name.toLowerCase().includes('briefing')).length} arquivos
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <File className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="font-medium">Referências</div>
                <div className="text-sm text-gray-600">
                  {documents.filter(doc => 
                    doc.name.toLowerCase().includes('referência') || 
                    doc.name.toLowerCase().includes('manual')
                  ).length} arquivos
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Upload className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <div className="font-medium">Outros</div>
                <div className="text-sm text-gray-600">
                  {documents.filter(doc => 
                    !doc.name.toLowerCase().includes('briefing') &&
                    !doc.name.toLowerCase().includes('referência') &&
                    !doc.name.toLowerCase().includes('manual')
                  ).length} arquivos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips for Clients */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Dicas para Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Mantenha seus briefings sempre atualizados e detalhados</li>
              <li>• Compartilhe referências visuais para facilitar o trabalho da agência</li>
              <li>• Organize os arquivos com nomes descritivos</li>
              <li>• Use pastas para categorizar diferentes tipos de documentos</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
