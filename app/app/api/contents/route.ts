
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')
    const clientId = searchParams.get('clientId')

    let whereClause: any = {}

    // Filter based on user role
    if (session.user.role === 'CLIENT') {
      whereClause.assigneeId = session.user.id
    } else {
      // Agency users can see all contents
      if (clientId) {
        whereClause.assigneeId = clientId
      }
    }

    // Additional filters
    if (status) {
      whereClause.status = status
    }

    if (platform) {
      whereClause.platforms = {
        has: platform
      }
    }

    const contents = await prisma.content.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true
          }
        },
        approvals: {
          include: {
            approver: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            comments: true,
            approvals: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(contents)
  } catch (error) {
    console.error('Error fetching contents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only agency users can create content
    if (session.user.role === 'CLIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      caption,
      contentType,
      platforms,
      mediaUrls,
      thumbnailUrl,
      scheduledDate,
      assigneeId
    } = body

    const content = await prisma.content.create({
      data: {
        title,
        description,
        caption,
        contentType,
        platforms,
        mediaUrls: mediaUrls || [],
        thumbnailUrl,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        creatorId: session.user.id,
        assigneeId
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true
          }
        }
      }
    })

    // Create notification for client
    if (assigneeId) {
      await prisma.notification.create({
        data: {
          type: 'APPROVAL_REQUESTED',
          title: 'Nova aprovação solicitada',
          message: `O conteúdo "${title}" precisa da sua aprovação.`,
          recipientId: assigneeId,
          senderId: session.user.id,
          contentId: content.id
        }
      })
    }

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
