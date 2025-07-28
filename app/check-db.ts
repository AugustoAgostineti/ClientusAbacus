
import { prisma } from './lib/db';

async function checkDatabase() {
  console.log('📊 Verificando conteúdos no banco de dados...\n')
  
  const contents = await prisma.content.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      creatorId: true,
      assigneeId: true,
      creator: { select: { name: true, email: true } },
      assignee: { select: { name: true, email: true } }
    }
  })
  
  console.log('Total de conteúdos:', contents.length)
  console.log('\n--- DETALHES DOS CONTEÚDOS ---')
  
  contents.forEach((content, index) => {
    console.log(`${index + 1}. Título: ${content.title}`)
    console.log(`   Status: ${content.status}`)
    console.log(`   Criador: ${content.creator.name} (${content.creator.email})`)
    console.log(`   Assignee: ${content.assignee?.name || 'Não atribuído'} (${content.assignee?.email || 'N/A'})`)
    console.log(`   IDs: creator=${content.creatorId}, assignee=${content.assigneeId}`)
    console.log('   ---')
  })
  
  // Contar por status
  const statusCounts: { [key: string]: number } = {}
  contents.forEach(c => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1
  })
  
  console.log('\n📈 CONTAGEM POR STATUS:')
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`   ${status}: ${count}`)
  })
  
  // Verificar se existem conteúdos PENDING_APPROVAL
  const pendingApproval = contents.filter(c => c.status === 'PENDING_APPROVAL')
  console.log(`\n⏳ Conteúdos PENDING_APPROVAL: ${pendingApproval.length}`)
  
  // Verificar usuários também
  console.log('\n👥 USUÁRIOS NO SISTEMA:')
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true }
  })
  users.forEach(user => {
    console.log(`   ${user.name} (${user.email}) - ${user.role} - ID: ${user.id}`)
  })
  
  await prisma.$disconnect()
}

checkDatabase().catch(console.error)

