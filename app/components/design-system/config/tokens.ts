
// Design System Tokens - Liquid Glass Style (iOS 26)
export const liquidGlassTokens = {
  // Cores principais da paleta
  colors: {
    primary: {
      'blue-violet': '#5C7CFA',
      'blue-violet-light': '#7C94FB',
      'blue-violet-dark': '#4C6CF9',
    },
    secondary: {
      'lime-green': '#B4F461',
      'lime-green-light': '#C4F581',
      'lime-green-dark': '#A4E441',
    },
    accent: {
      'lilac': '#D8C8F7',
      'lilac-light': '#E8D8FF',
      'lilac-dark': '#C8B8E7',
    },
    neutral: {
      'ice': '#F9FAFB',
      'frost': '#F3F4F6',
      'mist': '#E5E7EB',
      'smoke': '#9CA3AF',
      'charcoal': '#374151',
    }
  },

  // Efeitos glassmorphism
  glass: {
    backgrounds: {
      light: 'rgba(255, 255, 255, 0.7)',
      medium: 'rgba(255, 255, 255, 0.5)',
      dark: 'rgba(255, 255, 255, 0.3)',
      tinted: 'rgba(92, 124, 250, 0.1)',
    },
    borders: {
      light: 'rgba(255, 255, 255, 0.4)',
      medium: 'rgba(255, 255, 255, 0.6)',
      accent: 'rgba(92, 124, 250, 0.3)',
    },
    shadows: {
      soft: '0 4px 16px rgba(0, 0, 0, 0.08)',
      medium: '0 8px 32px rgba(0, 0, 0, 0.12)',
      strong: '0 16px 64px rgba(0, 0, 0, 0.16)',
    },
    blur: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
    }
  },

  // Bordas arredondadas
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },

  // Animações suaves
  transitions: {
    fast: '150ms ease-out',
    normal: '250ms ease-out',
    slow: '350ms ease-out',
  },

  // Transformações
  transforms: {
    hover: 'scale(1.02)',
    press: 'scale(0.98)',
  },

  // Tipografia
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  }
} as const

// Utilitários para glassmorphism
export const glassUtils = {
  // Gera classes para efeito glass
  getGlassClasses: (variant: 'light' | 'medium' | 'dark' | 'tinted' = 'light') => {
    const baseClasses = 'backdrop-blur-md border border-opacity-40'
    
    switch (variant) {
      case 'light':
        return `${baseClasses} bg-white/70 border-white/40`
      case 'medium':
        return `${baseClasses} bg-white/50 border-white/40`
      case 'dark':
        return `${baseClasses} bg-white/30 border-white/40`
      case 'tinted':
        return `${baseClasses} bg-blue-500/10 border-blue-500/30`
      default:
        return `${baseClasses} bg-white/70 border-white/40`
    }
  },

  // Gera classes para hover states
  getHoverClasses: () => 'hover:scale-[1.02] hover:shadow-lg transition-all duration-250',

  // Gera classes para sombras
  getShadowClasses: (intensity: 'soft' | 'medium' | 'strong' = 'soft') => {
    switch (intensity) {
      case 'soft':
        return 'shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
      case 'medium':
        return 'shadow-[0_8px_32px_rgba(0,0,0,0.12)]'
      case 'strong':
        return 'shadow-[0_16px_64px_rgba(0,0,0,0.16)]'
      default:
        return 'shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
    }
  }
}
