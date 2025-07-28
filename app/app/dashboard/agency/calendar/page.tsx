
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AgencyCalendarPage } from '@/components/pages/agency-calendar'

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role === 'CLIENT') {
    redirect('/dashboard/client')
  }

  return <AgencyCalendarPage />
}
