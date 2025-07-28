
import { UserRole } from '@prisma/client'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      companyName?: string
    }
  }

  interface User {
    role: UserRole
    companyName?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    companyName?: string
  }
}
