
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AgencyDashboard } from '@/components/dashboards/agency-dashboard'

export default async function AgencyDashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role === 'CLIENT') {
    redirect('/dashboard/client')
  }

  return <AgencyDashboard />
}
