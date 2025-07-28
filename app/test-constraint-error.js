
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testContentCreation() {
  try {
    console.log('🔍 Testing content creation to reproduce constraint error...');
    
    // First, let's see if there are any existing contents
    const existingContents = await prisma.content.findMany({
      select: {
        id: true,
        creatorId: true,
        title: true
      }
    });
    
    console.log('📊 Existing contents:', existingContents);
    
    // Get a user to test with
    const testUser = await prisma.user.findFirst({
      where: {
        role: { in: ['ADMIN_AGENCY', 'EMPLOYEE_AGENCY'] }
      }
    });
    
    if (!testUser) {
      console.log('❌ No agency user found for testing');
      return;
    }
    
    console.log('👤 Test user:', { id: testUser.id, email: testUser.email, role: testUser.role });
    
    // Get a client to assign content to
    const testClient = await prisma.user.findFirst({
      where: {
        role: 'CLIENT'
      }
    });
    
    if (!testClient) {
      console.log('❌ No client found for testing');
      return;
    }
    
    console.log('👥 Test client:', { id: testClient.id, email: testClient.email });
    
    // Try to create multiple contents with the same creator to test constraint
    console.log('📝 Creating first content...');
    const content1 = await prisma.content.create({
      data: {
        title: 'Test Content 1',
        description: 'Test description 1',
        contentType: 'IMAGE',
        platforms: ['INSTAGRAM'],
        creatorId: testUser.id,
        assigneeId: testClient.id
      }
    });
    
    console.log('✅ First content created:', content1.id);
    
    // Now try to create a second content with the same creator
    console.log('📝 Creating second content with same creator...');
    const content2 = await prisma.content.create({
      data: {
        title: 'Test Content 2',
        description: 'Test description 2',
        contentType: 'VIDEO',
        platforms: ['FACEBOOK'],
        creatorId: testUser.id,  // Same creator - this should trigger the constraint error
        assigneeId: testClient.id
      }
    });
    
    console.log('✅ Second content created:', content2.id);
    console.log('🎉 No constraint error - multiple contents per creator allowed!');
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
    if (error.code === 'P2002') {
      console.error('🔍 Unique constraint violation detected:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testContentCreation();
