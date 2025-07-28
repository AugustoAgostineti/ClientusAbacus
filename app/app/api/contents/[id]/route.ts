
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
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Check if content exists and user has permission
    const existingContent = await prisma.content.findUnique({
      where: { id: params.id }
    })

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Only creator or admin can update content
    if (session.user.role === 'CLIENT' || 
        (session.user.role === 'EMPLOYEE_AGENCY' && existingContent.creatorId !== session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const content = await prisma.content.update({
      where: { id: params.id },
      data: {
        ...body,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
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

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
