
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testReapprovalFlow() {
  try {
    console.log('🚀 Starting reapproval flow test...\n')

    // 1. Find an agency user and a client
    const agencyUser = await prisma.user.findFirst({
      where: { role: { in: ['ADMIN_AGENCY', 'EMPLOYEE_AGENCY'] } }
    })
    
    const clientUser = await prisma.user.findFirst({
      where: { role: 'CLIENT' }
    })

    if (!agencyUser || !clientUser) {
      console.log('❌ No agency user or client found. Creating test users...')
      return
    }

    console.log('✅ Found test users:')
    console.log(`   Agency: ${agencyUser.name} (${agencyUser.email})`)
    console.log(`   Client: ${clientUser.name} (${clientUser.email})\n`)

    // 2. Create a test content
    console.log('📝 Creating test content...')
    const content = await prisma.content.create({
      data: {
        title: 'Test Content for Reapproval',
        description: 'Testing reapproval flow',
        caption: 'Original caption',
        contentType: 'IMAGE',
        platforms: ['INSTAGRAM'],
        mediaUrls: [],
        status: 'APPROVED', // Start with APPROVED status
        creatorId: agencyUser.id,
        assigneeId: clientUser.id
      }
    })

    console.log(`✅ Created content with ID: ${content.id}`)
    console.log(`   Initial Status: ${content.status}\n`)

    // 3. Create an approval for this content
    console.log('👍 Creating approval record...')
    await prisma.approval.create({
      data: {
        contentId: content.id,
        approverId: clientUser.id,
        approved: true,
        feedback: 'Initial approval'
      }
    })

    console.log('✅ Approval record created\n')

    // 4. Simulate content edit (like the API would do)
    console.log('✏️ Simulating content edit...')
    
    const existingContent = await prisma.content.findUnique({
      where: { id: content.id }
    })

    // Simulate the logic from our updated API
    const assigneeId = clientUser.id
    const newTitle = 'EDITED Test Content for Reapproval'
    const isContentChanged = newTitle !== existingContent.title

    let newStatus = existingContent.status
    let statusMessage = ''
    
    if (assigneeId) {
      if (isContentChanged) {
        newStatus = 'PENDING_APPROVAL'
        statusMessage = 'Content modified and sent for approval'
        
        // Clear previous approvals
        await prisma.approval.deleteMany({
          where: { contentId: content.id }
        })
        console.log('🗑️ Previous approvals cleared')
      }
    }

    // Update the content
    const updatedContent = await prisma.content.update({
      where: { id: content.id },
      data: {
        title: newTitle,
        status: newStatus,
        updatedAt: new Date()
      }
    })

    console.log(`✅ Content updated:`)
    console.log(`   New Title: ${updatedContent.title}`)
    console.log(`   New Status: ${updatedContent.status}`)
    console.log(`   Status Message: ${statusMessage}\n`)

    // 5. Verify the results
    console.log('🔍 Verifying results...')
    
    const finalContent = await prisma.content.findUnique({
      where: { id: content.id },
      include: {
        approvals: true
      }
    })

    const approvalsCount = finalContent.approvals.length

    console.log('📊 Final Results:')
    console.log(`   Content Status: ${finalContent.status}`)
    console.log(`   Approvals Count: ${approvalsCount}`)
    console.log(`   Expected Status: PENDING_APPROVAL`)
    console.log(`   Expected Approvals: 0 (cleared)\n`)

    // 6. Test Results
    const testPassed = 
      finalContent.status === 'PENDING_APPROVAL' && 
      approvalsCount === 0

    if (testPassed) {
      console.log('✅ TEST PASSED: Reapproval flow works correctly!')
      console.log('   ✓ Status reset to PENDING_APPROVAL')
      console.log('   ✓ Previous approvals cleared')
    } else {
      console.log('❌ TEST FAILED:')
      if (finalContent.status !== 'PENDING_APPROVAL') {
        console.log(`   ✗ Status should be PENDING_APPROVAL, got ${finalContent.status}`)
      }
      if (approvalsCount !== 0) {
        console.log(`   ✗ Approvals should be 0, got ${approvalsCount}`)
      }
    }

    // 7. Cleanup
    console.log('\n🧹 Cleaning up test data...')
    await prisma.content.delete({
      where: { id: content.id }
    })
    console.log('✅ Test content deleted')

  } catch (error) {
    console.error('❌ Test failed with error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testReapprovalFlow()
