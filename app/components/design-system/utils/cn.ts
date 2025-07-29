
import { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { clsx } from "clsx"

// Utilitário específico para o design system
export function cnGlass(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para combinar classes de glassmorphism
export function glassClasses(
  baseClasses: string,
  glassVariant: 'light' | 'medium' | 'dark' | 'tinted' = 'light',
  additionalClasses?: string
) {
  const glassEffects = {
    light: 'bg-white/70 backdrop-blur-md border border-white/40',
    medium: 'bg-white/50 backdrop-blur-md border border-white/40',
    dark: 'bg-white/30 backdrop-blur-md border border-white/40',
    tinted: 'bg-blue-500/10 backdrop-blur-md border border-blue-500/30',
  }

  return cnGlass(
    baseClasses,
    glassEffects[glassVariant],
    'shadow-[0_4px_16px_rgba(0,0,0,0.08)]',
    additionalClasses
  )
}

// Função para classes de hover com animações
export function hoverClasses(baseClasses: string, animated: boolean = true) {
  return cnGlass(
    baseClasses,
    animated && 'hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-250 ease-out'
  )
}

// Função para aplicar bordas arredondadas consistentes
export function roundedClasses(
  baseClasses: string,
  radius: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' = 'lg'
) {
  const radiusMap = {
    sm: 'rounded-lg',      // 8px
    md: 'rounded-xl',      // 12px
    lg: 'rounded-2xl',     // 16px
    xl: 'rounded-3xl',     // 20px
    '2xl': 'rounded-[24px]', // 24px
    full: 'rounded-full',
  }

  return cnGlass(baseClasses, radiusMap[radius])
}
