
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
  Trash2,
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

export function AgencyDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      // This would be a real API call
      // For now, using mock data
      const mockDocuments: Document[] = [
        {
          id: '1',
          name: 'Briefing - Campanha Q1 2025',
          fileUrl: 'https://example.com/briefing-q1-2025.pdf',
          fileSize: 2048000,
          mimeType: 'application/pdf',
          description: 'Briefing completo da campanha do primeiro trimestre',
          createdAt: new Date().toISOString(),
          uploader: {
            id: '1',
            name: 'Carlos Santos',
            role: 'CLIENT'
          }
        },
        {
          id: '2',
          name: 'Manual da Marca - Empresa ABC',
          fileUrl: 'https://example.com/manual-marca-abc.pdf',
          fileSize: 5120000,
          mimeType: 'application/pdf',
          description: 'Diretrizes visuais e de comunicação da marca',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          uploader: {
            id: '2',
            name: 'John Doe',
            role: 'ADMIN_AGENCY'
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
    return File
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      'ADMIN_AGENCY': 'Admin',
      'EMPLOYEE_AGENCY': 'Agência',
      'CLIENT': 'Cliente'
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
      <DashboardLayout title="Documentos" description="Gerencie seus documentos">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Documentos"
      description="Armazene e gerencie documentos importantes do projeto"
    >
      <div className="space-y-6">
        {/* Actions and Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="mr-2 h-4 w-4" />
            Upload de Documento
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
                Faça upload de documentos
              </h3>
              <p className="text-gray-500 mb-4">
                Arraste e solte arquivos aqui ou clique para selecionar
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
                  : 'Comece fazendo upload dos seus primeiros documentos.'}
              </p>
              {!searchTerm && (
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Primeiro Documento
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
                          {document.uploader.name} ({getRoleLabel(document.uploader.role)})
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

        {/* Storage Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Armazenamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {documents.length}
                </div>
                <div className="text-sm text-gray-600">Total de Documentos</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatFileSize(documents.reduce((total, doc) => total + (doc.fileSize || 0), 0))}
                </div>
                <div className="text-sm text-gray-600">Espaço Utilizado</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {documents.filter(doc => 
                    new Date(doc.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length}
                </div>
                <div className="text-sm text-gray-600">Novos Este Mês</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
