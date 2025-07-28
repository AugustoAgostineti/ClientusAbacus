
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Helper function to detect changes between old and new content data
function detectContentChanges(oldData: any, newData: any) {
  const changedFields: string[] = []
  
  // Compare each field
  if (oldData.title !== newData.title) changedFields.push('title')
  if (oldData.description !== newData.description) changedFields.push('description')
  if (oldData.caption !== newData.caption) changedFields.push('caption')
  if (oldData.contentType !== newData.contentType) changedFields.push('contentType')
  if (JSON.stringify(oldData.platforms) !== JSON.stringify(newData.platforms)) changedFields.push('platforms')
  if (JSON.stringify(oldData.mediaUrls) !== JSON.stringify(newData.mediaUrls)) changedFields.push('mediaUrls')
  if (oldData.thumbnailUrl !== newData.thumbnailUrl) changedFields.push('thumbnailUrl')
  if (oldData.assigneeId !== newData.assigneeId) changedFields.push('assigneeId')
  
  // Compare scheduled date
  const oldDate = oldData.scheduledDate ? new Date(oldData.scheduledDate).getTime() : null
  const newDate = newData.scheduledDate ? new Date(newData.scheduledDate).getTime() : null
  if (oldDate !== newDate) changedFields.push('scheduledDate')
  
  return changedFields
}

// Helper function to create content history record
async function createContentHistoryRecord(
  contentId: string,
  previousData: any,
  newData: any,
  changedFields: string[],
  changedById: string,
  changeReason?: string
) {
  // Get the latest version number for this content
  const latestHistory = await prisma.contentHistory.findFirst({
    where: { contentId },
    orderBy: { version: 'desc' }
  })
  
  const nextVersion = latestHistory ? latestHistory.version + 1 : 1
  
  return await prisma.contentHistory.create({
    data: {
      contentId,
      version: nextVersion,
      previousData: previousData,
      newData: newData,
      changedFields,
      changedById,
      changeReason: changeReason || null
    }
  })
}

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
      assigneeId,
      changeReason // Optional reason for the change
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

    // Prepare current and new data for history tracking
    const previousData = {
      title: existingContent.title,
      description: existingContent.description,
      caption: existingContent.caption,
      contentType: existingContent.contentType,
      platforms: existingContent.platforms,
      mediaUrls: existingContent.mediaUrls,
      thumbnailUrl: existingContent.thumbnailUrl,
      scheduledDate: existingContent.scheduledDate,
      assigneeId: existingContent.assigneeId,
      status: existingContent.status
    }

    const newData = {
      title,
      description,
      caption,
      contentType,
      platforms,
      mediaUrls: mediaUrls || [],
      thumbnailUrl,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      assigneeId
    }

    // Detect changes for history tracking
    const changedFields = detectContentChanges(previousData, newData)
    const isContentChanged = changedFields.length > 0

    // Check if content should be sent for approval
    const shouldResetForApproval = assigneeId && assigneeId !== existingContent.assigneeId

    // Determine new status
    let newStatus = existingContent.status
    let statusMessage = ''
    
    if (assigneeId) {
      // If content has a client assigned and content was modified, reset to PENDING_APPROVAL
      if (isContentChanged || shouldResetForApproval) {
        newStatus = 'PENDING_APPROVAL'
        statusMessage = assigneeId !== existingContent.assigneeId 
          ? '🔄 Status updated: Content reassigned and sent for approval'
          : '🔄 Status updated: Content modified and sent for approval'
        console.log(`📤 PUT /api/contents/[id]: ${statusMessage}`)
      }
    } else {
      // If no client assigned, keep as DRAFT
      newStatus = 'DRAFT'
      statusMessage = '📝 Status: Content saved as DRAFT (no client assigned)'
      console.log(`💾 PUT /api/contents/[id]: ${statusMessage}`)
    }

    // If status is being reset to PENDING_APPROVAL, clear previous approvals
    if (newStatus === 'PENDING_APPROVAL' && existingContent.status !== 'PENDING_APPROVAL') {
      console.log('🗑️ PUT /api/contents/[id]: Clearing previous approvals for resubmission')
      await prisma.approval.deleteMany({
        where: { contentId: params.id }
      })
    }

    // Create history record if there are changes
    let historyRecord = null
    if (isContentChanged) {
      console.log('📋 PUT /api/contents/[id]: Changes detected, creating history record:', changedFields)
      
      try {
        historyRecord = await createContentHistoryRecord(
          params.id,
          previousData,
          { ...newData, status: newStatus }, // Include new status in the new data
          changedFields,
          session.user.id,
          changeReason
        )
        console.log('✅ PUT /api/contents/[id]: History record created:', historyRecord.id)
      } catch (historyError) {
        console.error('❌ PUT /api/contents/[id]: Failed to create history record:', historyError)
        // Continue with content update even if history fails - don't block the main operation
      }
    } else {
      console.log('ℹ️ PUT /api/contents/[id]: No content changes detected, skipping history record')
    }

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
        status: newStatus,
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

    // Include status change information in response
    const response = {
      ...content,
      statusChanged: newStatus !== existingContent.status,
      statusMessage: statusMessage,
      wasResentForApproval: newStatus === 'PENDING_APPROVAL' && existingContent.status !== 'PENDING_APPROVAL',
      historyCreated: historyRecord !== null,
      historyVersion: historyRecord?.version || null,
      changedFields: changedFields.length > 0 ? changedFields : null
    }

    return NextResponse.json(response)
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
