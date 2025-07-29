

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

    // Only clients can access this endpoint
    if (session.user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let whereClause: any = {
      assigneeId: session.user.id
    }

    // Filter by status if provided
    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    // Filter by platform if provided
    if (platform && platform !== 'ALL') {
      whereClause.platforms = {
        has: platform
      }
    }

    // Get total count for pagination
    const totalCount = await prisma.content.count({
      where: whereClause
    })

    // Fetch posts with detailed information
    const posts = await prisma.content.findMany({
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
          },
          take: 1 // Get only the latest approval
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
          },
          take: 3 // Get only the latest 3 comments for preview
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
      },
      skip: offset,
      take: limit
    })

    // Transform data for better frontend consumption
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      caption: post.caption,
      contentType: post.contentType,
      platforms: post.platforms,
      mediaUrls: post.mediaUrls,
      thumbnailUrl: post.thumbnailUrl,
      status: post.status,
      scheduledDate: post.scheduledDate,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      creator: post.creator,
      assignee: post.assignee,
      latestApproval: post.approvals?.[0] || null,
      recentComments: post.comments,
      stats: {
        totalComments: post._count.comments,
        totalApprovals: post._count.approvals
      },
      // Additional computed fields
      statusInfo: getStatusInfo(post.status),
      mediaType: getMediaType(post.mediaUrls),
      mediaCount: post.mediaUrls?.length || 0
    }))

    const response = {
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      },
      stats: {
        total: totalCount,
        pending: await prisma.content.count({
          where: { ...whereClause, status: 'PENDING_APPROVAL' }
        }),
        approved: await prisma.content.count({
          where: { ...whereClause, status: 'APPROVED' }
        }),
        rejected: await prisma.content.count({
          where: { ...whereClause, status: 'REJECTED' }
        })
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching client posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to get status info
function getStatusInfo(status: string) {
  const statusMap = {
    'DRAFT': {
      label: 'Rascunho',
      color: 'gray',
      icon: 'FileText'
    },
    'PENDING_APPROVAL': {
      label: 'Aguardando Aprovação',
      color: 'yellow',
      icon: 'Clock'
    },
    'APPROVED': {
      label: 'Aprovado',
      color: 'green',
      icon: 'CheckCircle'
    },
    'REJECTED': {
      label: 'Solicitação de Alteração',
      color: 'red',
      icon: 'XCircle'
    },
    'SCHEDULED': {
      label: 'Agendado',
      color: 'blue',
      icon: 'Calendar'
    },
    'PUBLISHED': {
      label: 'Publicado',
      color: 'purple',
      icon: 'Share2'
    }
  }

  return statusMap[status as keyof typeof statusMap] || {
    label: status,
    color: 'gray',
    icon: 'FileText'
  }
}

// Helper function to determine media type
function getMediaType(mediaUrls: string[] | null) {
  if (!mediaUrls || mediaUrls.length === 0) {
    return { type: 'text', label: 'Texto', icon: 'FileText' }
  }

  const hasVideo = mediaUrls.some(url => 
    url.includes('.mp4') || url.includes('.mov') || url.includes('.avi')
  )
  
  if (hasVideo) {
    return { type: 'video', label: 'Vídeo', icon: 'Video' }
  }

  if (mediaUrls.length > 1) {
    return { type: 'carousel', label: 'Carrossel', icon: 'Images' }
  }

  return { type: 'image', label: 'Imagem', icon: 'Image' }
}
