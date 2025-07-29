
# 📱 clintus Abacus
### Sistema de Gestão e Aprovação de Conteúdo para Mídias Sociais

Um sistema moderno e completo para agências digitais gerenciarem o processo de criação, aprovação e publicação de conteúdo para mídias sociais de seus clientes.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)  
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=flat-square&logo=typescript)  
![Prisma](https://img.shields.io/badge/Prisma-6.7-2D3748?style=flat-square&logo=prisma)  
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)  
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)

---

## 🎯 **Sobre o Projeto**

O **clintus Abacus** é uma plataforma SaaS desenvolvida para otimizar o fluxo de trabalho entre agências digitais e seus clientes no processo de aprovação de conteúdo para redes sociais. Com uma interface moderna e intuitiva, o sistema facilita a colaboração, agiliza aprovações e mantém um histórico completo de todas as interações.

### ✨ **Características Principais**

- **🏢 Dashboard para Agências**: Gestão completa de clientes, conteúdos e calendário editorial
- **👤 Dashboard para Clientes**: Interface simplificada para aprovação de conteúdos
- **📊 Sistema de Aprovação**: Workflow estruturado com feedback detalhado
- **💬 Comentários**: Sistema de comunicação integrado por conteúdo
- **📅 Calendário Editorial**: Visualização e planejamento de publicações
- **📁 Gestão de Arquivos**: Upload e organização de mídias e documentos
- **🔔 Notificações**: Sistema completo de alertas e atualizações
- **📜 Histórico de Versões**: Controle completo de alterações e revisões

---

## 🚀 **Tecnologias Utilizadas**

### **Frontend**
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações e transições
- **Shadcn/ui** - Componentes de interface moderna
- **Lucide React** - Ícones consistentes

### **Backend**
- **Next.js API Routes** - API integrada
- **Prisma ORM** - Mapeamento objeto-relacional
- **NextAuth.js** - Autenticação e autorização
- **Supabase PostgreSQL** - Banco de dados em nuvem

### **Autenticação**
- **NextAuth.js v4** - Sistema completo de autenticação
- **bcryptjs** - Hash de senhas
- **Suporte a Sessões** - Gerenciamento de estado de login

---

## 📦 **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Conta no GitHub

### **1. Clone o Repositório**
```bash
git clone https://github.com/AugustoAgostineti/ClientusAbacus.git
cd ClientusAbacus/app
```

### **2. Instale as Dependências**
```bash
npm install --legacy-peer-deps
# ou
yarn install
```

### **3. Configuração do Ambiente**

Crie um arquivo `.env` na pasta `app/` com as seguintes variáveis:

```env
# Database Configuration (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.SEU_PROJETO:SUA_SENHA@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="SUA_CHAVE_SECRETA_ALEATORIA"

# Supabase Configuration
SUPABASE_URL="https://SEU_PROJETO.supabase.co"
SUPABASE_ANON_KEY="SUA_CHAVE_PUBLICA"
SUPABASE_SERVICE_ROLE_KEY="SUA_CHAVE_SERVICE_ROLE"
```

### **4. Configuração do Banco de Dados**

#### **Opção A: Via Console Supabase (Recomendado)**
1. Acesse o console do Supabase
2. Vá para **SQL Editor**
3. Execute o conteúdo do arquivo `supabase-schema.sql`

#### **Opção B: Via Prisma (se conectividade estiver funcionando)**
```bash
npx prisma db push
npx prisma generate
```

### **5. Popular com Dados de Teste**
```bash
npm run seed
# ou
yarn prisma db seed
```

### **6. Executar o Projeto**
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em: **http://localhost:3000**

---

## 👥 **Contas de Teste**

### **🏢 Contas de Agência**
- **Admin**: `john@doe.com` / `johndoe123`
- **Funcionário**: `maria@agency.com` / `maria123`

### **👤 Contas de Cliente**
- **Cliente 1**: `carlos@empresa.com` / `carlos123`
- **Cliente 2**: `ana@loja.com` / `ana123`
- **Cliente 3**: `roberto@startup.com` / `roberto123`

---

## 🎨 **Funcionalidades Detalhadas**

### **Dashboard da Agência**
- ✅ Visão geral de todos os conteúdos
- ✅ Gestão de clientes
- ✅ Criação e edição de conteúdos
- ✅ Calendário editorial completo
- ✅ Sistema de comentários
- ✅ Gestão de documentos
- ✅ Notificações em tempo real

### **Dashboard do Cliente**
- ✅ Visualização de conteúdos para aprovação
- ✅ Sistema de aprovação com feedback
- ✅ Histórico de publicações
- ✅ Comentários por conteúdo
- ✅ Calendário de publicações
- ✅ Área de documentos compartilhados

### **Sistema de Aprovação**
- ✅ Status: Draft → Pending → Approved/Rejected
- ✅ Feedback detalhado por aprovação
- ✅ Notificações automáticas
- ✅ Histórico completo de alterações

---

## 🗂️ **Estrutura do Projeto**

```
app/
├── app/                    # App Router do Next.js
│   ├── api/               # Rotas da API
│   ├── auth/              # Páginas de autenticação  
│   ├── dashboard/         # Dashboards (agency/client)
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── auth/             # Componentes de autenticação
│   ├── dashboards/       # Dashboards principais
│   ├── pages/            # Componentes de página
│   └── ui/               # Componentes de interface
├── lib/                  # Utilitários
│   ├── auth.ts           # Configuração NextAuth
│   ├── db.ts             # Cliente Prisma
│   └── supabase.ts       # Cliente Supabase
├── prisma/               # Schema do banco
└── scripts/              # Scripts utilitários
```

---

## 🚀 **Deploy**

### **Vercel (Recomendado)**

1. **Conecte o repositório** no Vercel
2. **Configure as variáveis de ambiente**:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (URL de produção)
   - `NEXTAUTH_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Deploy automático** será feito a cada push na main

### **Outras Plataformas**
- Railway
- Heroku  
- DigitalOcean App Platform

---

## 🔧 **Scripts Disponíveis**

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting do código
npm run seed         # Popular banco com dados de teste
```

---

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 **Suporte**

Para dúvidas, sugestões ou problemas:

- 📧 **Email**: augusto@agostineti.com  
- 🐛 **Issues**: [GitHub Issues](https://github.com/AugustoAgostineti/ClientusAbacus/issues)
- 📚 **Documentação**: [Wiki do Projeto](https://github.com/AugustoAgostineti/ClientusAbacus/wiki)

---

<div align="center">

**✨ Desenvolvido com ❤️ para otimizar o workflow de agências digitais ✨**

[![GitHub Stars](https://img.shields.io/github/stars/AugustoAgostineti/ClientusAbacus?style=social)](https://github.com/AugustoAgostineti/ClientusAbacus/stargazers)  
[![GitHub Forks](https://img.shields.io/github/forks/AugustoAgostineti/ClientusAbacus?style=social)](https://github.com/AugustoAgostineti/ClientusAbacus/network/members)

</div>
