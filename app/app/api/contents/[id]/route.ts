
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const content = await prisma.content.findUnique({
      where: { id: params.id },
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
        }
      }
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Check access permissions
    if (session.user.role === 'CLIENT' && content.assigneeId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 PUT /api/contents/[id]: Starting content update for ID:', params.id)
    
    const session = await getServerSession(authOptions)
    if (!session) {
      console.log('❌ PUT /api/contents/[id]: No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ PUT /api/contents/[id]: Session found', { 
      userId: session.user.id, 
      role: session.user.role 
    })

    const body = await request.json()
    console.log('📝 PUT /api/contents/[id]: Request body received', JSON.stringify(body, null, 2))
    
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
      console.log('❌ PUT /api/contents/[id]: Missing title')
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!contentType) {
      console.log('❌ PUT /api/contents/[id]: Missing contentType')
      return NextResponse.json({ error: 'Content type is required' }, { status: 400 })
    }

    if (!platforms || platforms.length === 0) {
      console.log('❌ PUT /api/contents/[id]: Missing platforms')
      return NextResponse.json({ error: 'At least one platform is required' }, { status: 400 })
    }

    if (!assigneeId) {
      console.log('❌ PUT /api/contents/[id]: Missing assigneeId')
      return NextResponse.json({ error: 'Client assignment is required' }, { status: 400 })
    }
    
    // Check if content exists and user has permission
    const existingContent = await prisma.content.findUnique({
      where: { id: params.id }
    })

    if (!existingContent) {
      console.log('❌ PUT /api/contents/[id]: Content not found')
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Only creator or admin can update content
    if (session.user.role === 'CLIENT' || 
        (session.user.role === 'EMPLOYEE_AGENCY' && existingContent.creatorId !== session.user.id)) {
      console.log('❌ PUT /api/contents/[id]: Insufficient permissions')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.log('✅ PUT /api/contents/[id]: All validations passed, updating content...')

    const content = await prisma.content.update({
      where: { id: params.id },
      data: {
        title,
        description,
        caption,
        contentType,
        platforms,
        mediaUrls: mediaUrls || [],
        thumbnailUrl,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        assigneeId,
        // Preserve status - don't change it during edit
        updatedAt: new Date()
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

    console.log('✅ PUT /api/contents/[id]: Content updated successfully', { contentId: content.id })

    return NextResponse.json(content)
  } catch (error: any) {
    console.error('❌ PUT /api/contents/[id]: Error updating content:', error)
    console.error('❌ PUT /api/contents/[id]: Error details:', {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id: params.id }
    })

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Only admin or creator can delete content
    if (session.user.role === 'CLIENT' || 
        (session.user.role === 'EMPLOYEE_AGENCY' && existingContent.creatorId !== session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.content.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Content deleted successfully' })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
