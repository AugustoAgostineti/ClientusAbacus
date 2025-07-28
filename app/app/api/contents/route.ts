
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
    console.log('🚀 POST /api/contents: Starting content creation')
    
    const session = await getServerSession(authOptions)
    if (!session) {
      console.log('❌ POST /api/contents: No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ POST /api/contents: Session found', { 
      userId: session.user.id, 
      role: session.user.role,
      email: session.user.email 
    })

    // Only agency users can create content
    if (session.user.role === 'CLIENT') {
      console.log('❌ POST /api/contents: Client role forbidden')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    console.log('📝 POST /api/contents: Request body received', JSON.stringify(body, null, 2))
    
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

    // Validate required fields
    if (!title) {
      console.log('❌ POST /api/contents: Missing title')
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!contentType) {
      console.log('❌ POST /api/contents: Missing contentType')
      return NextResponse.json({ error: 'Content type is required' }, { status: 400 })
    }

    if (!platforms || platforms.length === 0) {
      console.log('❌ POST /api/contents: Missing platforms')
      return NextResponse.json({ error: 'At least one platform is required' }, { status: 400 })
    }

    if (!assigneeId) {
      console.log('❌ POST /api/contents: Missing assigneeId')
      return NextResponse.json({ error: 'Client assignment is required' }, { status: 400 })
    }

    console.log('✅ POST /api/contents: All validations passed, creating content...')

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

    console.log('✅ POST /api/contents: Content created successfully', { contentId: content.id })

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
      console.log('✅ POST /api/contents: Notification created for client')
    }

    return NextResponse.json(content, { status: 201 })
  } catch (error: any) {
    console.error('❌ POST /api/contents: Error creating content:', error)
    console.error('❌ POST /api/contents: Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      code: error?.code
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}
