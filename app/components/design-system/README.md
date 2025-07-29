
# Design System Liquid Glass (iOS 26 Style)

Sistema de design completo no estilo "liquid glass" com componentes modulares e compatíveis com a estrutura existente.

## 🎨 Características Principais

### Glassmorphism
- Fundos translúcidos com `rgba(255,255,255,0.7)`
- Efeito blur com `backdrop-blur-md`
- Bordas brancas com 40% de opacidade
- Sombras sutis e elegantes

### Paleta de Cores
- **Azul-violeta**: `#5C7CFA` (cor primária)
- **Verde-limão**: `#B4F461` (cor secundária)
- **Lilás**: `#D8C8F7` (cor de destaque)
- **Neutros**: `#F9FAFB`, `#F3F4F6` (backgrounds)

### Animações
- Hover states com `scale(1.02)`
- Transições suaves de 250ms
- Microanimações elegantes

### Bordas
- Rounded corners de `rounded-xl` a `rounded-2xl`
- Consistência visual em todos os componentes

## 📁 Estrutura

```
design-system/
├── config/
│   └── tokens.ts          # Tokens de design (cores, sombras, etc.)
├── types/
│   └── index.ts           # Tipos TypeScript
├── utils/
│   └── cn.ts              # Utilitários para classes CSS
├── components/            # Componentes (a serem criados)
│   ├── button/
│   ├── card/
│   ├── navbar/
│   ├── sidebar/
│   ├── modal/
│   ├── table/
│   └── chart/
├── index.ts               # Exports centralizados
└── README.md              # Documentação
```

## 🚀 Como Usar

```typescript
import { cnGlass, glassClasses, liquidGlassTokens } from '@/components/design-system'

// Aplicar efeito glass
const className = glassClasses('p-4', 'light', 'hover:scale-105')

// Usar tokens de cor
const primaryColor = liquidGlassTokens.colors.primary['blue-violet']
```

## 🛡️ Compatibilidade

- ✅ Totalmente compatível com componentes existentes
- ✅ Não altera nenhum código atual
- ✅ Pode ser usado junto com shadcn/ui
- ✅ Suporte completo ao Tailwind CSS
- ✅ TypeScript first

## 📋 Próximas Fases

1. **Componentes de Botão** - Variants primary, secondary, ghost, pill
2. **Componentes de Card** - Básico, com header, com imagem, com CTA
3. **Navbar Translúcido** - Topo moderno e responsivo
4. **Sidebar Vertical** - Navegação elegante
5. **Modal Glassmorphism** - Diálogos com blur
6. **Tabela Limpa** - Dados organizados
7. **Widgets de Gráfico** - Visualizações modernas
8. **Página de Showcase** - Documentação visual

## 🎯 Filosofia

Este design system foi criado para ser:
- **Modular**: Cada componente é independente
- **Compatível**: Funciona com a estrutura atual
- **Elegante**: Estética moderna iOS 26
- **Funcional**: Componentes práticos e úteis
- **Escalável**: Fácil de expandir e manter
