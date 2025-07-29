
import { PrismaClient, UserRole, ContentType, Platform, ContentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🌱 Starting Supabase database seed...')

    // Clean existing data (in correct order for foreign key constraints)
    console.log('🧹 Cleaning existing data...')
    await prisma.notification.deleteMany()
    await prisma.contentHistory.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.approval.deleteMany()
    await prisma.document.deleteMany()
    await prisma.content.deleteMany()
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.verificationToken.deleteMany()
    await prisma.user.deleteMany()

    console.log('✅ Cleaned existing data')

    // Create users
    const hashedPassword = await bcrypt.hash('johndoe123', 12)
    
    // Admin agency user
    const adminAgency = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: hashedPassword,
        role: UserRole.ADMIN_AGENCY,
        companyName: 'Creative Agency'
      }
    })

    // Employee agency user
    const employeeAgency = await prisma.user.create({
      data: {
        name: 'Maria Silva',
        email: 'maria@agency.com',
        password: await bcrypt.hash('maria123', 12),
        role: UserRole.EMPLOYEE_AGENCY,
        companyName: 'Creative Agency'
      }
    })

    // Client users
    const client1 = await prisma.user.create({
      data: {
        name: 'Carlos Santos',
        email: 'carlos@empresa.com',
        password: await bcrypt.hash('carlos123', 12),
        role: UserRole.CLIENT,
        companyName: 'Empresa ABC',
        agencyManagerId: adminAgency.id
      }
    })

    const client2 = await prisma.user.create({
      data: {
        name: 'Ana Costa',
        email: 'ana@loja.com',
        password: await bcrypt.hash('ana123', 12),
        role: UserRole.CLIENT,
        companyName: 'Loja XYZ',
        agencyManagerId: adminAgency.id
      }
    })

    const client3 = await prisma.user.create({
      data: {
        name: 'Roberto Lima',
        email: 'roberto@startup.com',
        password: await bcrypt.hash('roberto123', 12),
        role: UserRole.CLIENT,
        companyName: 'Startup 123',
        agencyManagerId: employeeAgency.id
      }
    })

    console.log('👥 Created users')

    // Create content
    const content1 = await prisma.content.create({
      data: {
        title: 'Post Instagram - Nova Campanha',
        description: 'Conteúdo promocional para o lançamento do novo produto',
        caption: 'Descubra nossa nova linha de produtos! 🚀 #novidade #produto',
        contentType: ContentType.IMAGE,
        platforms: [Platform.INSTAGRAM, Platform.FACEBOOK],
        mediaUrls: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200',
        status: ContentStatus.PENDING_APPROVAL,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        creatorId: employeeAgency.id,
        assigneeId: client1.id
      }
    })

    const content2 = await prisma.content.create({
      data: {
        title: 'Story Facebook - Promoção',
        description: 'Story promocional para desconto de final de semana',
        caption: 'Aproveite 30% OFF até domingo! 🛍️',
        contentType: ContentType.STORY,
        platforms: [Platform.FACEBOOK],
        mediaUrls: ['https://images.unsplash.com/photo-1607082349566-187342175e2f?w=500'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=200',
        status: ContentStatus.APPROVED,
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        creatorId: adminAgency.id,
        assigneeId: client2.id
      }
    })

    const content3 = await prisma.content.create({
      data: {
        title: 'Vídeo TikTok - Tendência',
        description: 'Vídeo seguindo tendência atual do TikTok',
        caption: 'Seguindo a tendência! 🔥 #trend #viral',
        contentType: ContentType.VIDEO,
        platforms: [Platform.TIKTOK],
        mediaUrls: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200',
        status: ContentStatus.REVISION_REQUESTED,
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        creatorId: employeeAgency.id,
        assigneeId: client3.id
      }
    })

    const content4 = await prisma.content.create({
      data: {
        title: 'Carrossel Instagram - Tutorial',
        description: 'Carrossel educativo sobre como usar o produto',
        caption: 'Aprenda a usar nosso produto em 5 passos! 📚 #tutorial #dicas',
        contentType: ContentType.CAROUSEL,
        platforms: [Platform.INSTAGRAM],
        mediaUrls: [
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500',
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500'
        ],
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200',
        status: ContentStatus.PUBLISHED,
        scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        creatorId: adminAgency.id,
        assigneeId: client1.id
      }
    })

    console.log('📄 Created content')

    // Create approvals
    await prisma.approval.create({
      data: {
        approved: true,
        feedback: 'Perfeito! Pode publicar.',
        approvedAt: new Date(),
        contentId: content2.id,
        approverId: client2.id
      }
    })

    await prisma.approval.create({
      data: {
        approved: false,
        feedback: 'Por favor, altere a legenda para algo mais informal e adicione mais emojis.',
        contentId: content3.id,
        approverId: client3.id
      }
    })

    await prisma.approval.create({
      data: {
        approved: true,
        feedback: 'Excelente trabalho! Muito educativo.',
        approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        contentId: content4.id,
        approverId: client1.id
      }
    })

    console.log('✅ Created approvals')

    // Create comments
    await prisma.comment.create({
      data: {
        message: 'Ótimo conceito! Posso sugerir usar cores mais vibrantes?',
        contentId: content1.id,
        authorId: client1.id
      }
    })

    await prisma.comment.create({
      data: {
        message: 'Vou ajustar as cores conforme sugerido. Obrigado pelo feedback!',
        contentId: content1.id,
        authorId: employeeAgency.id
      }
    })

    await prisma.comment.create({
      data: {
        message: 'O vídeo ficou muito bom, mas precisa ser mais dinâmico no início.',
        contentId: content3.id,
        authorId: client3.id
      }
    })

    console.log('💬 Created comments')

    // Create notifications
    await prisma.notification.create({
      data: {
        type: 'APPROVAL_REQUESTED',
        title: 'Nova aprovação solicitada',
        message: 'O conteúdo "Post Instagram - Nova Campanha" precisa da sua aprovação.',
        recipientId: client1.id,
        senderId: employeeAgency.id,
        contentId: content1.id
      }
    })

    await prisma.notification.create({
      data: {
        type: 'CONTENT_APPROVED',
        title: 'Conteúdo aprovado',
        message: 'O cliente aprovou o conteúdo "Story Facebook - Promoção".',
        recipientId: adminAgency.id,
        senderId: client2.id,
        contentId: content2.id,
        read: true
      }
    })

    await prisma.notification.create({
      data: {
        type: 'REVISION_REQUESTED',
        title: 'Revisão solicitada',
        message: 'O cliente solicitou alterações no conteúdo "Vídeo TikTok - Tendência".',
        recipientId: employeeAgency.id,
        senderId: client3.id,
        contentId: content3.id
      }
    })

    console.log('🔔 Created notifications')

    // Create documents
    await prisma.document.create({
      data: {
        name: 'Briefing - Campanha Q1 2025',
        fileUrl: 'https://example.com/briefing-q1-2025.pdf',
        fileSize: 2048000,
        mimeType: 'application/pdf',
        description: 'Briefing completo da campanha do primeiro trimestre',
        uploaderId: client1.id
      }
    })

    await prisma.document.create({
      data: {
        name: 'Manual da Marca - Empresa ABC',
        fileUrl: 'https://example.com/manual-marca-abc.pdf',
        fileSize: 5120000,
        mimeType: 'application/pdf',
        description: 'Diretrizes visuais e de comunicação da marca',
        uploaderId: adminAgency.id
      }
    })

    console.log('📋 Created documents')

    console.log('✨ Database seeded successfully!')
    console.log(`
📊 Created:
  - 5 Users (1 admin agency, 1 employee agency, 3 clients)
  - 4 Contents (various types and statuses)
  - 3 Approvals
  - 3 Comments
  - 3 Notifications
  - 2 Documents

🔐 Test Accounts:
  - Admin: john@doe.com / johndoe123
  - Employee: maria@agency.com / maria123
  - Client 1: carlos@empresa.com / carlos123
  - Client 2: ana@loja.com / ana123
  - Client 3: roberto@startup.com / roberto123
    `)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
