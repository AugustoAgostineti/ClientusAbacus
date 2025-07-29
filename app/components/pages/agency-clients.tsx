
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
    console.log('🔄 COMPONENT: Starting fetchClients...')
    try {
      console.log('📡 COMPONENT: Making request to /api/users?role=CLIENT')
      const response = await fetch('/api/users?role=CLIENT')
      console.log('📡 COMPONENT: Response status:', response.status)
      console.log('📡 COMPONENT: Response ok:', response.ok)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ COMPONENT: Data received:', data)
        console.log('✅ COMPONENT: Number of clients:', data.length)
        setClients(data)
        console.log('✅ COMPONENT: State updated with clients')
      } else {
        console.error('❌ COMPONENT: Response not ok:', response.status, response.statusText)
        const errorData = await response.text()
        console.error('❌ COMPONENT: Error data:', errorData)
      }
    } catch (error) {
      console.error('❌ COMPONENT: Fetch error:', error)
    } finally {
      setLoading(false)
      console.log('🏁 COMPONENT: Loading set to false')
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
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl bg-gradient-to-r from-[#5C7CFA] to-[#7C94FB] text-white border border-white/40 hover:from-[#4C6CF9] hover:to-[#6C84FB] hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(92,124,250,0.25)] active:scale-[0.98] shadow-[0_4px_16px_rgba(92,124,250,0.15)] backdrop-blur-md transition-all duration-250 ease-out"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Cliente
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64 bg-white/70 backdrop-blur-md border-white/40 rounded-xl focus:ring-2 focus:ring-[#5C7CFA]/50 focus:border-[#5C7CFA]/50 transition-all duration-250"
            />
          </div>
        </div>

        {/* Clients Grid */}
        {filteredClients.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-250">
            <div className="p-8 text-center">
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
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl bg-gradient-to-r from-[#5C7CFA] to-[#7C94FB] text-white border border-white/40 hover:from-[#4C6CF9] hover:to-[#6C84FB] hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(92,124,250,0.25)] active:scale-[0.98] shadow-[0_4px_16px_rgba(92,124,250,0.15)] backdrop-blur-md transition-all duration-250 ease-out"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Cliente
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div 
                key={client.id} 
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:scale-[1.01] transition-all duration-250 ease-out"
              >
                <div className="p-6 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#D8C8F7] to-[#E8D8FF] text-[#5C7CFA] border border-white/40">
                      Cliente
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {client._count.assignedContents} conteúdos
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {client.name}
                  </h3>
                  {client.companyName && (
                    <p className="text-sm text-gray-600 mb-4">
                      {client.companyName}
                    </p>
                  )}
                </div>
                
                <div className="px-6 pb-6">
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-[#5C7CFA]" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    {client.companyName && (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-[#5C7CFA]" />
                        <span>{client.companyName}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-[#5C7CFA]" />
                      <span>
                        Cliente desde {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/70 hover:scale-[1.01] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-250 ease-out">
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Conteúdos
                    </button>
                    <button className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/70 hover:scale-[1.01] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-250 ease-out">
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
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
