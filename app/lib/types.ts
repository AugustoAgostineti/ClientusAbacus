// User and Session Types
export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN_AGENCY' | 'EMPLOYEE_AGENCY' | 'CLIENT'
  companyName?: string
}

// Content Types
export interface Content {
  id: string
  title: string
  description: string
  platforms: string[]
  mediaFiles: MediaFile[]
  status: ContentStatus
  authorId: string
  assigneeId?: string
  scheduledFor?: Date
  createdAt: Date
  updatedAt: Date
}

export interface MediaFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
}

export type ContentStatus = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SCHEDULED'
  | 'PUBLISHED'

// Platform Types
export const SOCIAL_PLATFORMS = [
  'Instagram',
  'Facebook',
  'TikTok',
  'YouTube',
  'LinkedIn',
  'Twitter'
] as const

export type SocialPlatform = typeof SOCIAL_PLATFORMS[number]

// Form Types
export interface ContentFormData {
  title: string
  description: string
  platforms: string[]
  scheduledFor?: string
}

// Utility Types
export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination Types
export interface PaginationParams {
  page: number
  limit: number
  total: number
}

// Filter Types
export interface ContentFilters {
  status?: string
  platform?: string
  clientId?: string
  search?: string
}