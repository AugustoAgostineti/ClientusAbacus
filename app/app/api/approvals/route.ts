
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contentId, approved, feedback } = body

    // Verify the content exists and user has permission to approve
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        creator: true,
        assignee: true
      }
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Only the assigned client can approve
    if (session.user.role !== 'CLIENT' || content.assigneeId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Create approval record
    const approval = await prisma.approval.create({
      data: {
        approved,
        feedback,
        approvedAt: approved ? new Date() : null,
        contentId,
        approverId: session.user.id
      },
      include: {
        approver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Update content status
    let newStatus: 'APPROVED' | 'REVISION_REQUESTED' | 'REJECTED'
    if (approved) {
      newStatus = 'APPROVED'
    } else {
      newStatus = feedback ? 'REVISION_REQUESTED' : 'REJECTED'
    }

    await prisma.content.update({
      where: { id: contentId },
      data: { status: newStatus }
    })

    // Create notification for creator
    const notificationMessage = approved 
      ? `O cliente aprovou o conteúdo "${content.title}".`
      : `O cliente solicitou ${feedback ? 'alterações' : 'rejeitou'} no conteúdo "${content.title}".`

    const notificationType = approved 
      ? 'CONTENT_APPROVED' 
      : feedback ? 'REVISION_REQUESTED' : 'CONTENT_REJECTED'

    await prisma.notification.create({
      data: {
        type: notificationType,
        title: approved ? 'Conteúdo aprovado' : feedback ? 'Revisão solicitada' : 'Conteúdo rejeitado',
        message: notificationMessage,
        recipientId: content.creatorId,
        senderId: session.user.id,
        contentId
      }
    })

    return NextResponse.json(approval, { status: 201 })
  } catch (error) {
    console.error('Error creating approval:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
