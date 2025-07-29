
# 📱 Sistema de Aprovação de Conteúdo para Redes Sociais

Um sistema completo de gerenciamento e aprovação de conteúdo para redes sociais, desenvolvido para agências e clientes colaborarem de forma eficiente.

## 🚀 Tecnologias Utilizadas

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, Shadcn/ui
- **Banco de Dados:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Autenticação:** NextAuth.js v4
- **Deploy:** Vercel-ready
- **Animações:** Framer Motion

## ✨ Funcionalidades Principais

### 👥 Para Agências
- **Dashboard Completo** - Visão geral de todos os projetos e clientes
- **Gerenciamento de Clientes** - Adicionar, editar e organizar clientes
- **Criação de Conteúdo** - Interface intuitiva para criação de posts
- **Calendário Editorial** - Planejamento visual de publicações
- **Histórico de Alterações** - Controle completo de versões
- **Comentários e Feedback** - Comunicação direta com clientes

### 👤 Para Clientes
- **Dashboard Personalizado** - Visão dos seus projetos
- **Aprovação de Conteúdo** - Sistema simples de aprovar/solicitar revisões
- **Visualização de Posts** - Gallery dos conteúdos criados
- **Downloads** - Baixar mídias aprovadas
- **Notificações** - Alertas sobre novos conteúdos
- **Comentários** - Feedback direto para a agência

### 📊 Recursos Técnicos
- **Interface Responsiva** - Funciona perfeitamente em mobile e desktop
- **Upload de Mídia** - Suporte para imagens, vídeos e carrosséis
- **Múltiplas Plataformas** - Instagram, Facebook, TikTok, YouTube
- **Sistema de Roles** - Admin, Employee, Client
- **Filtragem Avançada** - Por status, plataforma, data
- **Busca Inteligente** - Encontre qualquer conteúdo rapidamente

## 🛠️ Configuração do Ambiente

### Pré-requisitos
- Node.js 18+
- Yarn ou npm
- Conta no Supabase

### 1. Clone e Instale Dependências
```bash
git clone <repo-url>
cd social-media-approval-app/app
yarn install
```

### 2. Configure Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Database Configuration (Supabase)
DATABASE_URL="postgresql://postgres.your-project:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="sua-anon-key-aqui"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key-aqui"
```

### 3. Configure o Banco de Dados Supabase

#### 3.1. Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote as credenciais (URL, anon key, service role key)

#### 3.2. Executar Schema SQL
1. Acesse o SQL Editor no dashboard do Supabase
2. Execute o conteúdo do arquivo `supabase-schema.sql`
3. Verifique se todas as tabelas foram criadas

#### 3.3. Gerar Client Prisma e Popular Dados
```bash
# Gerar Prisma client
yarn prisma generate

# Popular dados de teste
yarn prisma db seed
```

### 4. Executar o Projeto
```bash
# Desenvolvimento
yarn dev

# Build para produção
yarn build
yarn start
```

O sistema estará disponível em `http://localhost:3000`

## 👨‍💻 Contas de Teste

Após executar o seed, você terá as seguintes contas disponíveis:

### 🏢 Agência
- **Admin:** john@doe.com / johndoe123
- **Employee:** maria@agency.com / maria123

### 👥 Clientes
- **Cliente 1:** carlos@empresa.com / carlos123
- **Cliente 2:** ana@loja.com / ana123
- **Cliente 3:** roberto@startup.com / roberto123

## 📁 Estrutura do Projeto

```
app/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API routes
│   ├── dashboard/         # Páginas do dashboard
│   └── auth/              # Páginas de autenticação
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Shadcn)
│   ├── pages/            # Componentes de página
│   └── layout/           # Componentes de layout
├── lib/                   # Utilitários e configurações
├── prisma/               # Schema e migrations
├── scripts/              # Scripts de desenvolvimento
└── uploads/              # Upload de arquivos
```

## 🎨 Design System

O projeto utiliza um design system baseado em:
- **Cores:** Paleta harmoniosa com accent colors
- **Tipografia:** Hierarquia clara e legível
- **Componentes:** Baseados no Shadcn/ui
- **Animações:** Framer Motion para transições suaves
- **Responsividade:** Mobile-first approach

## 🔒 Segurança

- **Autenticação:** NextAuth.js com sessões seguras
- **Autorização:** Role-based access control (RBAC)
- **Proteção de Rotas:** Middleware de autenticação
- **RLS:** Row Level Security no Supabase
- **Validação:** Esquemas Zod para validação de dados

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático em cada push

### Configurações de Produção
```env
NEXTAUTH_URL="https://seu-dominio.vercel.app"
# ... outras variáveis
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📋 Roadmap

- [ ] Integração com APIs das redes sociais
- [ ] Agendamento automático de posts
- [ ] Analytics e relatórios
- [ ] App mobile (React Native)
- [ ] Integração com ferramentas de design (Figma, Canva)
- [ ] Sistema de templates

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte e dúvidas:
- Abra uma [issue](../../issues)
- Entre em contato via email

---

**Desenvolvido com ❤️ para agências e clientes que valorizam eficiência e qualidade.**
