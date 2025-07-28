
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Checking users in database...');
    const users = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: { id: true, name: true, email: true, role: true, companyName: true }
    });
    console.log('👥 CLIENT users in database:', JSON.stringify(users, null, 2));
    
    console.log('📊 Total CLIENT users found:', users.length);
    
    // Also check all users to see what we have
    const allUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, companyName: true }
    });
    console.log('📋 All users in database:', JSON.stringify(allUsers, null, 2));
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
