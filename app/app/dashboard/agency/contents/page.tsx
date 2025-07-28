
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AgencyContentsPage } from '@/components/pages/agency-contents'

export default async function ContentsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role === 'CLIENT') {
    redirect('/dashboard/client')
  }

  return <AgencyContentsPage />
}
