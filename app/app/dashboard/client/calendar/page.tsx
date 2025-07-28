
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ClientCalendarPage } from '@/components/pages/client-calendar'

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'CLIENT') {
    redirect('/dashboard/agency')
  }

  return <ClientCalendarPage />
}
