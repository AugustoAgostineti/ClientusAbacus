
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
    const role = searchParams.get('role')

    let whereClause: any = {}

    // Agency users can see their clients
    if (session.user.role === 'ADMIN_AGENCY' || session.user.role === 'EMPLOYEE_AGENCY') {
      if (role === 'CLIENT') {
        whereClause = {
          role: 'CLIENT',
          OR: [
            { agencyManagerId: session.user.id },
            // Admin can see all clients
            ...(session.user.role === 'ADMIN_AGENCY' ? [{}] : [])
          ]
        }
      } else {
        // Can see all agency users
        whereClause = {
          role: {
            in: ['ADMIN_AGENCY', 'EMPLOYEE_AGENCY']
          }
        }
      }
    } else {
      // Clients can only see themselves
      whereClause = { id: session.user.id }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        createdAt: true,
        _count: {
          select: {
            createdContents: true,
            assignedContents: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
