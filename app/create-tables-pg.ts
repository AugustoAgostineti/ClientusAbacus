
import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

const createTablesSQL = `
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing enums if they exist
DROP TYPE IF EXISTS "ContentStatus" CASCADE;
DROP TYPE IF EXISTS "ContentType" CASCADE;
DROP TYPE IF EXISTS "NotificationType" CASCADE;
DROP TYPE IF EXISTS "Platform" CASCADE;
DROP TYPE IF EXISTS "UserRole" CASCADE;

-- Create enums
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REVISION_REQUESTED', 'REJECTED', 'PUBLISHED');
CREATE TYPE "ContentType" AS ENUM ('IMAGE', 'CAROUSEL', 'VIDEO', 'STORY');
CREATE TYPE "NotificationType" AS ENUM ('CONTENT_CREATED', 'APPROVAL_REQUESTED', 'CONTENT_APPROVED', 'REVISION_REQUESTED', 'CONTENT_REJECTED', 'CONTENT_PUBLISHED');
CREATE TYPE "Platform" AS ENUM ('INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'YOUTUBE');
CREATE TYPE "UserRole" AS ENUM ('ADMIN_AGENCY', 'EMPLOYEE_AGENCY', 'CLIENT');

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "documents" CASCADE;
DROP TABLE IF EXISTS "content_history" CASCADE;
DROP TABLE IF EXISTS "comments" CASCADE;
DROP TABLE IF EXISTS "approvals" CASCADE;
DROP TABLE IF EXISTS "contents" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Create users table
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT,
    "email" TEXT UNIQUE,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "companyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agencyManagerId" TEXT REFERENCES "users"("id")
);

-- Create Account table (NextAuth)
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

-- Create Session table (NextAuth)
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "expires" TIMESTAMP(3) NOT NULL
);

-- Create VerificationToken table (NextAuth)
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expires" TIMESTAMP(3) NOT NULL,
    UNIQUE("identifier", "token")
);

-- Create contents table
CREATE TABLE "contents" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "caption" TEXT,
    "contentType" "ContentType" NOT NULL,
    "platforms" "Platform"[] DEFAULT ARRAY[]::"Platform"[],
    "mediaUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "thumbnailUrl" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledDate" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL REFERENCES "users"("id"),
    "assigneeId" TEXT REFERENCES "users"("id")
);

-- Create approvals table
CREATE TABLE "approvals" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "approved" BOOLEAN,
    "feedback" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentId" TEXT NOT NULL REFERENCES "contents"("id") ON DELETE CASCADE,
    "approverId" TEXT NOT NULL REFERENCES "users"("id")
);

-- Create comments table
CREATE TABLE "comments" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentId" TEXT NOT NULL REFERENCES "contents"("id") ON DELETE CASCADE,
    "authorId" TEXT NOT NULL REFERENCES "users"("id")
);

-- Create content_history table
CREATE TABLE "content_history" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "contentId" TEXT NOT NULL REFERENCES "contents"("id") ON DELETE CASCADE,
    "version" INTEGER NOT NULL DEFAULT 1,
    "changeReason" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previousData" JSONB NOT NULL,
    "newData" JSONB NOT NULL,
    "changedFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "changedById" TEXT NOT NULL REFERENCES "users"("id")
);

-- Create documents table
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaderId" TEXT NOT NULL REFERENCES "users"("id")
);

-- Create notifications table
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipientId" TEXT NOT NULL REFERENCES "users"("id"),
    "senderId" TEXT REFERENCES "users"("id"),
    "contentId" TEXT REFERENCES "contents"("id")
);

-- Create indexes for better performance
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "contents_creatorId_idx" ON "contents"("creatorId");
CREATE INDEX "contents_assigneeId_idx" ON "contents"("assigneeId");
CREATE INDEX "contents_status_idx" ON "contents"("status");
CREATE INDEX "approvals_contentId_idx" ON "approvals"("contentId");
CREATE INDEX "comments_contentId_idx" ON "comments"("contentId");
CREATE INDEX "notifications_recipientId_idx" ON "notifications"("recipientId");
`

async function createTables() {
  try {
    console.log('Connecting to Supabase PostgreSQL...')
    await client.connect()
    
    console.log('Creating tables in Supabase...')
    const result = await client.query(createTablesSQL)
    
    console.log('✅ Tables created successfully!')
    console.log('Query result:', result.command, result.rowCount)
    
  } catch (err) {
    console.error('❌ Failed to create tables:', err)
  } finally {
    await client.end()
  }
}

createTables()
