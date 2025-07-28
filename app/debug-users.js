
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('\n=== Verificando usuários no banco ===')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`\nTotal de usuários: ${users.length}`)
    console.log('\nUsuários encontrados:')
    console.log('========================')
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Empresa: ${user.companyName || 'N/A'}`)
      console.log(`   Criado em: ${user.createdAt.toLocaleString('pt-BR')}`)
      console.log('   ---')
    })
    
    const clientCount = users.filter(u => u.role === 'CLIENT').length
    console.log(`\nTotal de CLIENTs: ${clientCount}`)
    
  } catch (error) {
    console.error('Erro ao consultar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
