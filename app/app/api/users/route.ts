
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      console.log('❌ API /users: No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ API /users: Session found:', {
      userId: session.user.id,
      userRole: session.user.role,
      userEmail: session.user.email
    })

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    
    console.log('🔍 API /users: Requested role filter:', role)

    let whereClause: any = {}

    // Agency users can see their clients
    if (session.user.role === 'ADMIN_AGENCY' || session.user.role === 'EMPLOYEE_AGENCY') {
      if (role === 'CLIENT') {
        if (session.user.role === 'ADMIN_AGENCY') {
          // Admin can see all clients
          whereClause = {
            role: 'CLIENT'
          }
          console.log('👑 Admin user - showing all clients')
        } else {
          // Employee can only see their assigned clients
          whereClause = {
            role: 'CLIENT',
            agencyManagerId: session.user.id
          }
          console.log('👤 Employee user - showing assigned clients only')
        }
      } else {
        // Can see all agency users
        whereClause = {
          role: {
            in: ['ADMIN_AGENCY', 'EMPLOYEE_AGENCY']
          }
        }
        console.log('🏢 Showing agency users')
      }
    } else {
      // Clients can only see themselves
      whereClause = { id: session.user.id }
      console.log('🔒 Client user - showing self only')
    }

    console.log('📋 Final whereClause:', JSON.stringify(whereClause, null, 2))

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

    console.log(`📊 API /users: Found ${users.length} users`)
    console.log('👥 Users found:', users.map(u => `${u.name} (${u.role})`))

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
