
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// Supported file types
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only agency users can upload files
    if (session.user.role === 'CLIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const uploadedFiles = []

    for (const file of files) {
      if (!file || file.size === 0) continue

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 50MB.` },
          { status: 400 }
        )
      }

      // Validate file type
      const isImage = SUPPORTED_IMAGE_TYPES.includes(file.type)
      const isVideo = SUPPORTED_VIDEO_TYPES.includes(file.type)

      if (!isImage && !isVideo) {
        return NextResponse.json(
          { error: `File type ${file.type} is not supported` },
          { status: 400 }
        )
      }

      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${timestamp}_${sanitizedName}`
      
      // Create upload directory structure
      const uploadDir = path.join(process.cwd(), 'uploads')
      const mediaDir = path.join(uploadDir, isImage ? 'images' : 'videos')
      
      if (!existsSync(mediaDir)) {
        await mkdir(mediaDir, { recursive: true })
      }

      // Save file
      const filePath = path.join(mediaDir, fileName)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      await writeFile(filePath, buffer)

      // Generate URL for accessing the file
      const fileUrl = `/api/files/${isImage ? 'images' : 'videos'}/${fileName}`

      uploadedFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        isImage,
        isVideo
      })
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}
