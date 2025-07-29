
'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/toaster'
import { Toaster as SonnerToaster } from './ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      basePath="/api/auth"
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster />
        <SonnerToaster />
      </ThemeProvider>
    </SessionProvider>
  )
}
