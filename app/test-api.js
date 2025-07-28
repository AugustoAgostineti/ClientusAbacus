
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function testAPI() {
  try {
    console.log('🧪 Testing API /users?role=CLIENT endpoint...');
    
    // Test the API directly using fetch
    const response = await fetch('http://localhost:3000/api/users?role=CLIENT', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 API Response status:', response.status);
    console.log('📡 API Response ok:', response.ok);
    
    const responseText = await response.text();
    console.log('📡 API Response text:', responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ API Success - Clients found:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError);
      }
    } else {
      console.error('❌ API Error - Status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

testAPI();
