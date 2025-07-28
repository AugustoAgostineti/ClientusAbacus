
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
    const { contentId, message } = body

    // Verify the content exists and user has permission to comment
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

    // Check permission: creator, assignee, or admin can comment
    const canComment = 
      content.creatorId === session.user.id ||
      content.assigneeId === session.user.id ||
      session.user.role === 'ADMIN_AGENCY'

    if (!canComment) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const comment = await prisma.comment.create({
      data: {
        message,
        contentId,
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    // Create notification for the other party
    let recipientId: string | null = null
    if (session.user.id === content.creatorId && content.assigneeId) {
      recipientId = content.assigneeId
    } else if (session.user.id === content.assigneeId) {
      recipientId = content.creatorId
    }

    if (recipientId) {
      await prisma.notification.create({
        data: {
          type: 'CONTENT_CREATED', // Using as generic comment notification
          title: 'Novo comentário',
          message: `${session.user.name} comentou no conteúdo "${content.title}".`,
          recipientId,
          senderId: session.user.id,
          contentId
        }
      })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
