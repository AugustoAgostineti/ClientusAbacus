
// Tipos TypeScript para o Design System Liquid Glass

export interface LiquidGlassComponentProps {
  className?: string
  children?: React.ReactNode
  variant?: 'light' | 'medium' | 'dark' | 'tinted'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  shadow?: 'soft' | 'medium' | 'strong'
  animated?: boolean
}

export interface ButtonVariants {
  variant: 'primary' | 'secondary' | 'ghost' | 'pill'
  size: 'sm' | 'md' | 'lg'
  glassEffect?: boolean
}

export interface CardVariants {
  variant: 'basic' | 'header' | 'image' | 'cta'
  padding: 'sm' | 'md' | 'lg'
  glassIntensity: 'light' | 'medium' | 'dark'
}

export interface NavbarVariants {
  variant: 'fixed' | 'sticky' | 'relative'
  transparency: 'transparent' | 'translucent' | 'opaque'
  blur: boolean
}

export interface SidebarVariants {
  variant: 'minimal' | 'expanded' | 'collapsible'
  position: 'left' | 'right'
  glassEffect: boolean
}

export interface ModalVariants {
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  backdrop: 'blur' | 'dark' | 'light'
  rounded: boolean
}

export interface TableVariants {
  variant: 'clean' | 'bordered' | 'striped'
  glassHeaders: boolean
  hoverEffect: boolean
}

export interface ChartVariants {
  theme: 'light' | 'dark' | 'pastel'
  glassBackground: boolean
  animated: boolean
}

// Props comuns para todos os componentes
export interface BaseComponentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
  children?: React.ReactNode
  asChild?: boolean
}

// Paleta de cores tipada
export type ColorPalette = {
  primary: {
    'blue-violet': string
    'blue-violet-light': string
    'blue-violet-dark': string
  }
  secondary: {
    'lime-green': string
    'lime-green-light': string
    'lime-green-dark': string
  }
  accent: {
    'lilac': string
    'lilac-light': string
    'lilac-dark': string
  }
  neutral: {
    'ice': string
    'frost': string
    'mist': string
    'smoke': string
    'charcoal': string
  }
}

// Utilitários de estilo
export type GlassVariant = 'light' | 'medium' | 'dark' | 'tinted'
export type BlurIntensity = 'sm' | 'md' | 'lg' | 'xl'
export type ShadowIntensity = 'soft' | 'medium' | 'strong'
export type BorderRadius = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
