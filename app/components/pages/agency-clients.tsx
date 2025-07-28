
'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AddClientModal } from '@/components/modals/add-client-modal'
import { 
  Users, 
  Search, 
  Mail, 
  Building,
  Calendar,
  FileText,
  Plus
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  companyName?: string
  createdAt: string
  _count: {
    assignedContents: number
  }
}

export function AgencyClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/users?role=CLIENT')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClientAdded = () => {
    fetchClients()
  }

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout title="Clientes" description="Gerencie seus clientes">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Clientes"
      description="Gerencie todos os seus clientes e seus projetos"
    >
      <div className="space-y-6">
        {/* Actions and Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Cliente
          </Button>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Clients Grid */}
        {filteredClients.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum cliente encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Tente ajustar o termo de busca.'
                  : 'Comece adicionando seus primeiros clientes.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Cliente
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Cliente
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {client._count.assignedContents} conteúdos
                    </span>
                  </div>
                  
                  <CardTitle className="text-lg">
                    {client.name}
                  </CardTitle>
                  {client.companyName && (
                    <CardDescription>
                      {client.companyName}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    {client.companyName && (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        <span>{client.companyName}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Cliente desde {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Conteúdos
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddClientModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onClientAdded={handleClientAdded}
      />
    </DashboardLayout>
  )
}
