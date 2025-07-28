
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ClientDocumentsPage } from '@/components/pages/client-documents'

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'CLIENT') {
    redirect('/dashboard/agency')
  }

  return <ClientDocumentsPage />
}
