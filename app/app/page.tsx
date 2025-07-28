
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Redirect based on user role
  if (session.user.role === 'CLIENT') {
    redirect('/dashboard/client')
  } else {
    redirect('/dashboard/agency')
  }
}
