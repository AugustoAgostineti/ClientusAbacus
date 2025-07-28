
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ClientCommentsPage } from '@/components/pages/client-comments'

export default async function CommentsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'CLIENT') {
    redirect('/dashboard/agency')
  }

  return <ClientCommentsPage />
}
