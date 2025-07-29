
import { DesignSystemShowcase } from '@/components/design-system/showcase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design System Liquid Glass - Showcase',
  description: 'Sistema de design completo no estilo iOS 26 com componentes modulares e glassmorphism',
}

export default function DesignSystemPage() {
  return <DesignSystemShowcase />
}
