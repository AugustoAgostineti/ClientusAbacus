
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

    // Check if content exists
    const content = await prisma.content.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        creatorId: true,
        assigneeId: true
      }
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Check access permissions
    const isCreator = content.creatorId === session.user.id
    const isAssignee = content.assigneeId === session.user.id
    const isAdmin = session.user.role === 'ADMIN_AGENCY'

    if (!isCreator && !isAssignee && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch content history
    const history = await prisma.contentHistory.findMany({
      where: { contentId: params.id },
      include: {
        changedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        version: 'desc'
      }
    })

    // Transform history data for better frontend consumption
    const transformedHistory = history.map(record => ({
      id: record.id,
      version: record.version,
      changedAt: record.changedAt,
      changeReason: record.changeReason,
      changedFields: record.changedFields,
      changedBy: record.changedBy,
      previousData: record.previousData,
      newData: record.newData,
      // Extract key changes for quick overview
      summary: generateChangeSummary(record.changedFields, record.previousData, record.newData)
    }))

    return NextResponse.json({
      contentId: params.id,
      totalVersions: history.length,
      history: transformedHistory
    })
  } catch (error) {
    console.error('Error fetching content history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to generate a human-readable summary of changes
function generateChangeSummary(changedFields: string[], previousData: any, newData: any) {
  const summary: string[] = []

  changedFields.forEach(field => {
    const oldValue = previousData[field]
    const newValue = newData[field]

    switch (field) {
      case 'title':
        summary.push(`Title changed from "${oldValue}" to "${newValue}"`)
        break
      case 'description':
        summary.push(`Description updated`)
        break
      case 'caption':
        summary.push(`Caption updated`)
        break
      case 'contentType':
        summary.push(`Content type changed from ${oldValue} to ${newValue}`)
        break
      case 'platforms':
        summary.push(`Platforms updated`)
        break
      case 'mediaUrls':
        const oldCount = Array.isArray(oldValue) ? oldValue.length : 0
        const newCount = Array.isArray(newValue) ? newValue.length : 0
        summary.push(`Media files changed (${oldCount} → ${newCount} files)`)
        break
      case 'thumbnailUrl':
        if (oldValue && newValue) {
          summary.push(`Thumbnail updated`)
        } else if (newValue) {
          summary.push(`Thumbnail added`)
        } else {
          summary.push(`Thumbnail removed`)
        }
        break
      case 'assigneeId':
        summary.push(`Client assignment changed`)
        break
      case 'scheduledDate':
        if (oldValue && newValue) {
          summary.push(`Scheduled date changed`)
        } else if (newValue) {
          summary.push(`Scheduled date added`)
        } else {
          summary.push(`Scheduled date removed`)
        }
        break
      default:
        summary.push(`${field} updated`)
    }
  })

  return summary
}
