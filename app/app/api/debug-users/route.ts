
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 DEBUG API: Testing user listing without auth')
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    
    let whereClause: any = {}
    
    if (role === 'CLIENT') {
      whereClause = { role: 'CLIENT' }
      console.log('🧪 DEBUG: Filtering for CLIENTs only')
    } else {
      console.log('🧪 DEBUG: No role filter, showing all users')
    }
    
    console.log('🧪 DEBUG whereClause:', JSON.stringify(whereClause, null, 2))

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

    console.log(`🧪 DEBUG: Found ${users.length} users`)
    console.log('🧪 DEBUG Users:', users.map(u => `${u.name} (${u.role})`))

    return NextResponse.json({
      debug: true,
      totalUsers: users.length,
      users: users
    })
  } catch (error) {
    console.error('🧪 DEBUG Error:', error)
    return NextResponse.json(
      { error: 'Debug API error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
