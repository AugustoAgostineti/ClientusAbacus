
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ContentDetailPage } from '@/components/pages/content-detail'

export default async function ContentDetailPageRoute({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role === 'CLIENT') {
    redirect('/dashboard/client')
  }

  return <ContentDetailPage contentId={params.id} />
}
