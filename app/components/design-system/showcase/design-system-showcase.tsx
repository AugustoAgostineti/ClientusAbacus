
'use client'

import * as React from "react"
import { cnGlass } from "../utils/cn"
import {
  LiquidButton,
  LiquidCard,
  LiquidCardHeader,
  LiquidCardTitle,
  LiquidCardDescription,
  LiquidCardContent,
  LiquidCardFooter,
  LiquidCardImage,
  LiquidCardWithCTA,
  LiquidNavbar,
  LiquidSidebar,
  LiquidModal,
  LiquidModalHeader,
  LiquidModalTitle,
  LiquidModalDescription,
  LiquidModalContent,
  LiquidModalFooter,
  LiquidTable,
  LiquidChart,
  LiquidLineChart,
  LiquidBarChart,
  LiquidAreaChart,
  LiquidPieChart,
  LiquidStatsCard,
} from "../components"
import { liquidGlassTokens } from "../config/tokens"
import {
  Palette,
  Sparkles,
  Layout,
  Mouse,
  Table,
  BarChart3,
  Eye,
  Code,
  FileImage,
  Users,
  Calendar,
  MessageSquare,
  Bell,
  FileText,
  TrendingUp,
  Activity,
  Zap,
  DollarSign,
  Download,
  Share2,
  Heart,
  Star,
  Play,
  Settings
} from "lucide-react"

// Dados de exemplo para componentes
const sampleData = {
  lineChart: [
    { name: 'Jan', value: 400 },
    { name: 'Fev', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Abr', value: 800 },
    { name: 'Mai', value: 500 },
    { name: 'Jun', value: 900 },
  ],
  barChart: [
    { name: 'Produto A', value: 4000 },
    { name: 'Produto B', value: 3000 },
    { name: 'Produto C', value: 2000 },
    { name: 'Produto D', value: 2780 },
    { name: 'Produto E', value: 1890 },
  ],
  pieChart: [
    { name: 'Desktop', value: 60 },
    { name: 'Mobile', value: 30 },
    { name: 'Tablet', value: 10 },
  ],
  tableData: [
    { id: 1, name: 'João Silva', email: 'joao@email.com', role: 'Admin', status: 'Ativo' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', role: 'Editor', status: 'Ativo' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', role: 'Viewer', status: 'Inativo' },
  ],
  sidebarItems: [
    { label: 'Dashboard', href: '#dashboard', icon: <Layout className="h-4 w-4" /> },
    { label: 'Conteúdos', href: '#contents', icon: <FileImage className="h-4 w-4" />, badge: '12' },
    { label: 'Usuários', href: '#users', icon: <Users className="h-4 w-4" /> },
    { label: 'Calendário', href: '#calendar', icon: <Calendar className="h-4 w-4" /> },
    { label: 'Comentários', href: '#comments', icon: <MessageSquare className="h-4 w-4" />, badge: '3' },
    { label: 'Notificações', href: '#notifications', icon: <Bell className="h-4 w-4" /> },
    { label: 'Documentos', href: '#documents', icon: <FileText className="h-4 w-4" /> },
  ]
}

interface ShowcaseSectionProps {
  title: string
  description: string
  children: React.ReactNode
  code?: string
}

const ShowcaseSection = ({ title, description, children, code }: ShowcaseSectionProps) => (
  <section className="mb-16">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#374151] mb-2">{title}</h2>
      <p className="text-[#9CA3AF]">{description}</p>
    </div>
    
    <div className="space-y-6">
      {/* Exemplo visual */}
      <LiquidCard variant="basic" className="p-6">
        {children}
      </LiquidCard>
      
      {/* Código de exemplo */}
      {code && (
        <LiquidCard variant="header" className="overflow-hidden">
          <LiquidCardHeader className="bg-[#374151] text-white py-3">
            <div className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span className="text-sm font-medium">Exemplo de Código</span>
            </div>
          </LiquidCardHeader>
          <LiquidCardContent className="p-0">
            <pre className="p-4 text-sm text-[#374151] bg-[#F9FAFB] overflow-x-auto">
              <code>{code}</code>
            </pre>
          </LiquidCardContent>
        </LiquidCard>
      )}
    </div>
  </section>
)

export function DesignSystemShowcase() {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const tableColumns = [
    { key: 'name', title: 'Nome', dataIndex: 'name' as const, sortable: true },
    { key: 'email', title: 'Email', dataIndex: 'email' as const },
    { key: 'role', title: 'Função', dataIndex: 'role' as const },
    { 
      key: 'status', 
      title: 'Status', 
      dataIndex: 'status' as const,
      render: (value: string) => (
        <span className={cnGlass(
          "px-2 py-1 rounded-full text-xs font-medium",
          value === 'Ativo' ? 'bg-[#B4F461]/20 text-[#374151]' : 'bg-red-100 text-red-800'
        )}>
          {value}
        </span>
      )
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#F3F4F6] to-[#E5E7EB]">
      {/* Header fixo */}
      <LiquidNavbar
        variant="fixed"
        logoText="Design System"
        menuItems={[
          { label: 'Components', href: '#components', icon: <Layout className="h-4 w-4" /> },
          { label: 'Colors', href: '#colors', icon: <Palette className="h-4 w-4" /> },
          { label: 'Examples', href: '#examples', icon: <Eye className="h-4 w-4" /> },
        ]}
        rightContent={
          <LiquidButton variant="primary" size="sm">
            <Download className="h-4 w-4" />
          </LiquidButton>
        }
      />

      {/* Conteúdo principal */}
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-[#5C7CFA]" />
            <h1 className="text-4xl font-bold text-[#374151]">
              Liquid Glass Design System
            </h1>
          </div>
          <p className="text-xl text-[#9CA3AF] mb-8 max-w-3xl mx-auto">
            Sistema de design completo no estilo iOS 26 com componentes modulares, 
            glassmorphism e animações suaves para criar interfaces modernas e elegantes.
          </p>
          
          <div className="flex items-center justify-center space-x-4 mb-12">
            <LiquidButton variant="primary" size="lg">
              <Play className="h-4 w-4" />
              Ver Componentes
            </LiquidButton>
            <LiquidButton variant="ghost" size="lg">
              <Code className="h-4 w-4" />
              Documentação
            </LiquidButton>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <LiquidStatsCard
              value="20+"
              label="Componentes"
              icon={<Layout className="h-6 w-6" />}
              trend={{ value: 15, label: 'este mês', direction: 'up' }}
            />
            <LiquidStatsCard
              value="8"
              label="Paleta de Cores"
              icon={<Palette className="h-6 w-6" />}
              trend={{ value: 100, label: 'cobertura', direction: 'neutral' }}
            />
            <LiquidStatsCard
              value="100%"
              label="Responsivo"
              icon={<Mouse className="h-6 w-6" />}
              trend={{ value: 12, label: 'dispositivos', direction: 'up' }}
            />
            <LiquidStatsCard
              value="A11Y"
              label="Acessibilidade"
              icon={<Eye className="h-6 w-6" />}
              trend={{ value: 95, label: 'score', direction: 'up' }}
            />
          </div>
        </div>

        {/* Paleta de Cores */}
        <ShowcaseSection
          title="Paleta de Cores"
          description="Cores cuidadosamente selecionadas para criar harmonia visual e hierarquia clara."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div 
                className="w-20 h-20 rounded-2xl mx-auto mb-3 shadow-lg"
                style={{ backgroundColor: liquidGlassTokens.colors.primary['blue-violet'] }}
              />
              <h4 className="font-medium text-[#374151] mb-1">Blue Violet</h4>
              <p className="text-sm text-[#9CA3AF]">#5C7CFA</p>
            </div>
            <div className="text-center">
              <div 
                className="w-20 h-20 rounded-2xl mx-auto mb-3 shadow-lg"
                style={{ backgroundColor: liquidGlassTokens.colors.secondary['lime-green'] }}
              />
              <h4 className="font-medium text-[#374151] mb-1">Lime Green</h4>
              <p className="text-sm text-[#9CA3AF]">#B4F461</p>
            </div>
            <div className="text-center">
              <div 
                className="w-20 h-20 rounded-2xl mx-auto mb-3 shadow-lg"
                style={{ backgroundColor: liquidGlassTokens.colors.accent['lilac'] }}
              />
              <h4 className="font-medium text-[#374151] mb-1">Lilac</h4>
              <p className="text-sm text-[#9CA3AF]">#D8C8F7</p>
            </div>
            <div className="text-center">
              <div 
                className="w-20 h-20 rounded-2xl mx-auto mb-3 shadow-lg"
                style={{ backgroundColor: liquidGlassTokens.colors.neutral['frost'] }}
              />
              <h4 className="font-medium text-[#374151] mb-1">Frost</h4>
              <p className="text-sm text-[#9CA3AF]">#F3F4F6</p>
            </div>
          </div>
        </ShowcaseSection>

        {/* Botões */}
        <ShowcaseSection
          title="Botões"
          description="Botões com efeito glassmorphism, múltiplas variações e animações suaves."
          code={`<LiquidButton variant="primary">Primary</LiquidButton>
<LiquidButton variant="secondary">Secondary</LiquidButton>
<LiquidButton variant="ghost">Ghost</LiquidButton>
<LiquidButton variant="pill">Pill</LiquidButton>`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <LiquidButton variant="primary">
              <Zap className="h-4 w-4" />
              Primary
            </LiquidButton>
            <LiquidButton variant="secondary">
              <Heart className="h-4 w-4" />
              Secondary
            </LiquidButton>
            <LiquidButton variant="ghost">
              <Share2 className="h-4 w-4" />
              Ghost
            </LiquidButton>
            <LiquidButton variant="pill">
              <Star className="h-4 w-4" />
              Pill
            </LiquidButton>
            <LiquidButton variant="primary" size="sm">Small</LiquidButton>
            <LiquidButton variant="primary" size="lg">Large</LiquidButton>
            <LiquidButton variant="primary" loading>Loading</LiquidButton>
          </div>
        </ShowcaseSection>

        {/* Cards */}
        <ShowcaseSection
          title="Cards"
          description="Cards versáteis com diferentes variações para diferentes necessidades."
          code={`<LiquidCard variant="basic">
  <LiquidCardHeader>
    <LiquidCardTitle>Título do Card</LiquidCardTitle>
    <LiquidCardDescription>Descrição do card</LiquidCardDescription>
  </LiquidCardHeader>
  <LiquidCardContent>Conteúdo do card</LiquidCardContent>
</LiquidCard>`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LiquidCard variant="basic">
              <LiquidCardHeader>
                <LiquidCardTitle>Card Básico</LiquidCardTitle>
                <LiquidCardDescription>
                  Um card simples e elegante com glassmorphism
                </LiquidCardDescription>
              </LiquidCardHeader>
              <LiquidCardContent>
                <p className="text-sm text-[#9CA3AF]">
                  Conteúdo do card com estilo translúcido e bordas arredondadas.
                </p>
              </LiquidCardContent>
              <LiquidCardFooter>
                <LiquidButton variant="ghost" size="sm">Ação</LiquidButton>
              </LiquidCardFooter>
            </LiquidCard>

            <LiquidCard variant="header">
              <LiquidCardHeader gradient>
                <LiquidCardTitle>Card com Header</LiquidCardTitle>
                <LiquidCardDescription>
                  Header com gradiente sutil
                </LiquidCardDescription>
              </LiquidCardHeader>
              <LiquidCardContent>
                <p className="text-sm text-[#9CA3AF]">
                  Este card possui um header destacado com gradiente.
                </p>
              </LiquidCardContent>
            </LiquidCard>

            <LiquidCardWithCTA
              title="Card com CTA"
              description="Card completo com call-to-action integrado"
              ctaText="Ver Mais"
              ctaAction={() => alert('CTA clicado!')}
              ctaVariant="primary"
            />
          </div>
        </ShowcaseSection>

        {/* Modal */}
        <ShowcaseSection
          title="Modal"
          description="Modais com efeito glassmorphism, backdrop blur e animações suaves."
          code={`<LiquidModal open={modalOpen} onOpenChange={setModalOpen}>
  <LiquidModalHeader>
    <LiquidModalTitle>Título do Modal</LiquidModalTitle>
    <LiquidModalDescription>Descrição do modal</LiquidModalDescription>
  </LiquidModalHeader>
  <LiquidModalContent>Conteúdo</LiquidModalContent>
  <LiquidModalFooter>
    <LiquidButton>Confirmar</LiquidButton>
  </LiquidModalFooter>
</LiquidModal>`}
        >
          <div className="flex items-center space-x-4">
            <LiquidButton variant="primary" onClick={() => setModalOpen(true)}>
              Abrir Modal
            </LiquidButton>
            <p className="text-sm text-[#9CA3AF]">
              Modal com backdrop blur e animações suaves
            </p>
          </div>

          <LiquidModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            size="md"
            backdrop="blur"
          >
            <LiquidModalHeader>
              <LiquidModalTitle>Exemplo de Modal</LiquidModalTitle>
              <LiquidModalDescription>
                Este é um exemplo de modal com design glassmorphism
              </LiquidModalDescription>
            </LiquidModalHeader>
            
            <LiquidModalContent>
              <p className="text-[#374151] mb-4">
                Os modais do Liquid Glass Design System possuem:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-[#9CA3AF]">
                <li>Efeito backdrop blur</li>
                <li>Animações suaves de entrada e saída</li>
                <li>Múltiplos tamanhos disponíveis</li>
                <li>Acessibilidade completa</li>
                <li>Fechamento por ESC ou backdrop</li>
              </ul>
            </LiquidModalContent>
            
            <LiquidModalFooter>
              <LiquidButton variant="ghost" onClick={() => setModalOpen(false)}>
                Cancelar
              </LiquidButton>
              <LiquidButton variant="primary" onClick={() => setModalOpen(false)}>
                Entendi
              </LiquidButton>
            </LiquidModalFooter>
          </LiquidModal>
        </ShowcaseSection>

        {/* Tabela */}
        <ShowcaseSection
          title="Tabela"
          description="Tabelas com design limpo, efeitos hover e funcionalidades completas."
          code={`<LiquidTable
  columns={columns}
  data={data}
  sortable
  hoverEffect
  variant="clean"
/>`}
        >
          <LiquidTable
            columns={tableColumns}
            data={sampleData.tableData}
            sortable
            hoverEffect
            variant="clean"
            onRowClick={(record) => alert(`Clicou em: ${record.name}`)}
          />
        </ShowcaseSection>

        {/* Gráficos */}
        <ShowcaseSection
          title="Gráficos"
          description="Componentes de gráfico com paleta de cores personalizada e efeito glassmorphism."
          code={`<LiquidLineChart
  title="Vendas Mensais"
  data={data}
  height={300}
  theme="light"
  animated
/>`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LiquidLineChart
              title="Vendas Mensais"
              description="Evolução das vendas ao longo do ano"
              data={sampleData.lineChart}
              height={250}
              theme="light"
              animated
            />
            
            <LiquidBarChart
              title="Produtos Mais Vendidos"
              description="Ranking de produtos por volume"
              data={sampleData.barChart}
              height={250}
              theme="light"
              animated
            />
            
            <LiquidAreaChart
              title="Crescimento Acumulado"
              description="Crescimento ao longo do período"
              data={sampleData.lineChart}
              height={250}
              theme="pastel"
              animated
            />
            
            <LiquidPieChart
              title="Dispositivos de Acesso"
              description="Distribuição por tipo de dispositivo"
              data={sampleData.pieChart}
              height={250}
              theme="light"
              animated
            />
          </div>
        </ShowcaseSection>

        {/* Sidebar Demo */}
        <ShowcaseSection
          title="Sidebar"
          description="Navegação lateral com múltiplas variações e efeito glassmorphism."
        >
          <div className="relative h-96 bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] rounded-2xl overflow-hidden">
            <LiquidSidebar
              variant="expanded"
              logoText="App Demo"
              items={sampleData.sidebarItems}
              userInfo={{
                name: "João Silva",
                email: "joao@email.com",
                role: "Admin"
              }}
              collapsed={sidebarCollapsed}
              onCollapse={setSidebarCollapsed}
              className="relative"
              onLogout={() => alert('Logout!')}
            />
            
            <div className="ml-64 p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <Layout className="h-12 w-12 text-[#5C7CFA] mx-auto mb-4" />
                <h4 className="text-lg font-medium text-[#374151] mb-2">
                  Área de Conteúdo
                </h4>
                <p className="text-sm text-[#9CA3AF]">
                  Esta seria a área principal da aplicação
                </p>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* Footer */}
        <div className="border-t border-white/20 pt-12 mt-16 text-center">
          <div className="mb-8">
            <Sparkles className="h-8 w-8 text-[#5C7CFA] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#374151] mb-2">
              Pronto para começar?
            </h3>
            <p className="text-[#9CA3AF] mb-6 max-w-2xl mx-auto">
              O Design System Liquid Glass está completo e pronto para uso. 
              Todos os componentes são modulares e compatíveis com sua aplicação existente.
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <LiquidButton variant="primary" size="lg">
                <Code className="h-4 w-4" />
                Começar a Usar
              </LiquidButton>
              <LiquidButton variant="secondary" size="lg">
                <FileText className="h-4 w-4" />
                Documentação
              </LiquidButton>
            </div>
          </div>
          
          <p className="text-sm text-[#9CA3AF]">
            Design System Liquid Glass • Criado com ❤️ para interfaces modernas
          </p>
        </div>
      </div>
    </div>
  )
}
