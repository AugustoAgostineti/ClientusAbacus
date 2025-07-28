
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

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: session.user.id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        content: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to last 50 notifications
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationIds, read } = body

    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds
        },
        recipientId: session.user.id // Ensure user can only update their own notifications
      },
      data: {
        read
      }
    })

    return NextResponse.json({ message: 'Notifications updated successfully' })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
