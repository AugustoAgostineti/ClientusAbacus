
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ztauiusnkquhifyzkjxh.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0YXVpdXNua3F1aGlmeXpranhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzcyMTQ0NSwiZXhwIjoyMDY5Mjk3NDQ1fQ.4p5T6EhwQx2t0QDLD3S4ZU9TGNSMW7BFPkHmjA6q8dc'

async function createTables() {
  try {
    console.log('🔄 Creating tables in Supabase...')
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create tables using SQL
    const createTablesSQL = `
      -- Create enums first
      CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REVISION_REQUESTED', 'REJECTED', 'PUBLISHED');
      CREATE TYPE "ContentType" AS ENUM ('IMAGE', 'CAROUSEL', 'VIDEO', 'STORY');
      CREATE TYPE "NotificationType" AS ENUM ('CONTENT_CREATED', 'APPROVAL_REQUESTED', 'CONTENT_APPROVED', 'REVISION_REQUESTED', 'CONTENT_REJECTED', 'CONTENT_PUBLISHED');
      CREATE TYPE "Platform" AS ENUM ('INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'YOUTUBE');
      CREATE TYPE "UserRole" AS ENUM ('ADMIN_AGENCY', 'EMPLOYEE_AGENCY', 'CLIENT');

      -- Create tables
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "name" TEXT,
        "email" TEXT UNIQUE,
        "emailVerified" TIMESTAMP,
        "image" TEXT,
        "password" TEXT,
        "role" "UserRole" DEFAULT 'CLIENT',
        "companyName" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "agencyManagerId" TEXT REFERENCES "users"("id")
      );

      CREATE TABLE IF NOT EXISTS "accounts" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        UNIQUE("provider", "providerAccountId")
      );

      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "expires" TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "verification_tokens" (
        "identifier" TEXT NOT NULL,
        "token" TEXT UNIQUE NOT NULL,
        "expires" TIMESTAMP NOT NULL,
        UNIQUE("identifier", "token")
      );

      CREATE TABLE IF NOT EXISTS "contents" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "caption" TEXT,
        "contentType" "ContentType" NOT NULL,
        "platforms" "Platform"[] DEFAULT '{}',
        "mediaUrls" TEXT[] DEFAULT '{}',
        "thumbnailUrl" TEXT,
        "status" "ContentStatus" DEFAULT 'DRAFT',
        "scheduledDate" TIMESTAMP,
        "publishedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "creatorId" TEXT NOT NULL REFERENCES "users"("id"),
        "assigneeId" TEXT REFERENCES "users"("id")
      );

      CREATE TABLE IF NOT EXISTS "approvals" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "approved" BOOLEAN,
        "feedback" TEXT,
        "approvedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "contentId" TEXT NOT NULL REFERENCES "contents"("id") ON DELETE CASCADE,
        "approverId" TEXT NOT NULL REFERENCES "users"("id")
      );

      CREATE TABLE IF NOT EXISTS "comments" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "message" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "contentId" TEXT NOT NULL REFERENCES "contents"("id") ON DELETE CASCADE,
        "authorId" TEXT NOT NULL REFERENCES "users"("id")
      );

      CREATE TABLE IF NOT EXISTS "documents" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "fileUrl" TEXT NOT NULL,
        "fileSize" INTEGER,
        "mimeType" TEXT,
        "description" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "uploaderId" TEXT NOT NULL REFERENCES "users"("id")
      );

      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "type" "NotificationType" NOT NULL,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "read" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "recipientId" TEXT NOT NULL REFERENCES "users"("id"),
        "senderId" TEXT REFERENCES "users"("id"),
        "contentId" TEXT REFERENCES "contents"("id")
      );
    `

    const { data, error } = await supabase.rpc('exec_sql', { 
      query: createTablesSQL 
    })

    if (error) {
      console.log('❌ Error creating tables:', error.message)
      
      // Try alternative approach with individual queries
      console.log('🔄 Trying alternative approach...')
      
      const queries = createTablesSQL.split(';').filter(q => q.trim())
      
      for (let query of queries) {
        if (query.trim()) {
          const { error: queryError } = await supabase.rpc('exec_sql', { 
            query: query.trim() + ';' 
          })
          if (queryError) {
            console.log('⚠️ Query error:', query.substring(0, 50) + '...', queryError.message)
          }
        }
      }
    } else {
      console.log('✅ Tables created successfully!')
      console.log('📊 Result:', data)
    }
    
  } catch (error) {
    console.error('💥 Script failed:', error.message)
  }
}

createTables()
