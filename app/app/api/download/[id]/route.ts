

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

interface DownloadParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: DownloadParams) {
  try {
    console.log('🔽 Download request for content ID:', params.id)
    
    const session = await getServerSession(authOptions)
    if (!session) {
      console.log('❌ No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the content from database
    const content = await prisma.content.findUnique({
      where: { id: params.id },
      include: {
        assignee: {
          select: {
            id: true,
            name: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!content) {
      console.log('❌ Content not found')
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Check permissions - only client assigned to content or agency users can download
    const isClient = session.user.role === 'CLIENT'
    const isAgency = session.user.role === 'ADMIN_AGENCY' || session.user.role === 'EMPLOYEE_AGENCY'
    const isAssignedClient = isClient && content.assigneeId === session.user.id

    if (!isAssignedClient && !isAgency) {
      console.log('❌ Forbidden - user not authorized for this content')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.log('✅ User authorized for download')

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'single' // single, zip, all
    const fileIndex = searchParams.get('index') // for specific file in array

    if (!content.mediaUrls || content.mediaUrls.length === 0) {
      console.log('❌ No media files to download')
      return NextResponse.json({ error: 'No media files available' }, { status: 404 })
    }

    // Handle single file download
    if (type === 'single' && fileIndex !== null) {
      const index = parseInt(fileIndex)
      if (index < 0 || index >= content.mediaUrls.length) {
        return NextResponse.json({ error: 'Invalid file index' }, { status: 400 })
      }

      const fileUrl = content.mediaUrls[index]
      return await downloadSingleFile(fileUrl, content.title, index)
    }

    // Handle multiple files as ZIP
    if (type === 'zip' || type === 'all') {
      return await downloadAsZip(content.mediaUrls, content.title)
    }

    // Default: first file
    return await downloadSingleFile(content.mediaUrls[0], content.title, 0)

  } catch (error) {
    console.error('❌ Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function downloadSingleFile(fileUrl: string, contentTitle: string, index: number) {
  try {
    console.log('📁 Downloading single file:', fileUrl)
    
    // Extract filename from URL or create one
    const urlParts = fileUrl.split('/')
    const originalFilename = urlParts[urlParts.length - 1]
    const fileExtension = path.extname(originalFilename)
    const cleanTitle = contentTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)
    
    // Create a clean filename
    const filename = `${cleanTitle}_${index + 1}${fileExtension}`

    // Check if it's a local file (starts with uploads/)
    if (fileUrl.startsWith('/api/files/') || fileUrl.includes('uploads/')) {
      // Local file - read from uploads directory
      const relativePath = fileUrl.replace('/api/files/', '')
      const filePath = path.join(process.cwd(), 'uploads', relativePath)
      
      console.log('📂 Reading local file from:', filePath)
      
      if (!fs.existsSync(filePath)) {
        console.log('❌ Local file not found:', filePath)
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }

      const fileBuffer = fs.readFileSync(filePath)
      const mimeType = getMimeType(fileExtension)
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': fileBuffer.length.toString()
        }
      })
    } else {
      // External URL - fetch and return
      console.log('🌐 Fetching external file:', fileUrl)
      
      const response = await fetch(fileUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`)
      }

      const fileBuffer = await response.arrayBuffer()
      const mimeType = response.headers.get('content-type') || getMimeType(fileExtension)
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': fileBuffer.byteLength.toString()
        }
      })
    }
  } catch (error) {
    console.error('❌ Single file download error:', error)
    throw error
  }
}

async function downloadAsZip(mediaUrls: string[], contentTitle: string) {
  // For now, return the first file. In a full implementation, 
  // you would use a library like 'archiver' to create ZIP files
  console.log('📦 ZIP download requested - returning first file for now')
  return await downloadSingleFile(mediaUrls[0], contentTitle, 0)
}

function getMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream'
}
