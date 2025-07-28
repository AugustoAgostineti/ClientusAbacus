
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ClientApprovalsPage } from '@/components/pages/client-approvals'

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'CLIENT') {
    redirect('/dashboard/agency')
  }

  return <ClientApprovalsPage />
}
