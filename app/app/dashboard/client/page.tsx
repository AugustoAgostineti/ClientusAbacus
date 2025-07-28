
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ClientDashboard } from '@/components/dashboards/client-dashboard'

export default async function ClientDashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'CLIENT') {
    redirect('/dashboard/agency')
  }

  return <ClientDashboard />
}
