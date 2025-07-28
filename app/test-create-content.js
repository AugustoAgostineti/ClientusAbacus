
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

async function testCreateContent() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🧪 Testing content creation directly with Prisma...')
    
    // First, let's get a valid client ID
    const clients = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: { id: true, name: true, email: true }
    })
    
    console.log('✅ Found clients:', clients.length)
    if (clients.length === 0) {
      console.log('❌ No clients found!')
      return
    }
    
    const client = clients[0]
    console.log('📋 Using client:', { id: client.id, name: client.name })
    
    // Get an agency user as creator
    const agencyUser = await prisma.user.findFirst({
      where: { role: { in: ['ADMIN_AGENCY', 'EMPLOYEE_AGENCY'] } },
      select: { id: true, name: true, role: true }
    })
    
    if (!agencyUser) {
      console.log('❌ No agency user found!')
      return
    }
    
    console.log('👤 Using agency user:', { id: agencyUser.id, name: agencyUser.name, role: agencyUser.role })
    
    // Test data that matches exactly what frontend should send
    const testData = {
      title: 'Teste de Conteúdo',
      description: 'Descrição do teste',
      caption: 'Legenda do teste',
      contentType: 'IMAGE',
      platforms: ['INSTAGRAM', 'FACEBOOK'],
      mediaUrls: [],
      thumbnailUrl: null,
      scheduledDate: null,
      creatorId: agencyUser.id,
      assigneeId: client.id
    }
    
    console.log('📝 Test data:', JSON.stringify(testData, null, 2))
    
    const content = await prisma.content.create({
      data: testData,
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
    
    console.log('✅ Content created successfully!', { 
      id: content.id, 
      title: content.title,
      creatorName: content.creator.name,
      assigneeName: content.assignee.name 
    })
    
    // Cleanup - delete the test content
    await prisma.content.delete({
      where: { id: content.id }
    })
    
    console.log('🧹 Test content deleted')
    
  } catch (error) {
    console.error('❌ Error testing content creation:', error)
    console.error('❌ Error details:', {
      name: error?.name,
      message: error?.message,
      code: error?.code
    })
  } finally {
    await prisma.$disconnect()
  }
}

testCreateContent()
