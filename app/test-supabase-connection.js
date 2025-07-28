
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ztauiusnkquhifyzkjxh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0YXVpdXNua3F1aGlmeXpranhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjE0NDUsImV4cCI6MjA2OTI5NzQ0NX0.3j5JgkeZZE8YUN85__d3ibpbYOUqm0qMBXX5cUwT6II'

async function testConnection() {
  try {
    console.log('🔄 Testing Supabase connection...')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test basic connectivity
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Error:', error.message)
      console.log('🔍 This might mean tables don\'t exist yet, which is expected')
    } else {
      console.log('✅ Connection successful!')
      console.log('📊 Data:', data)
    }
    
  } catch (error) {
    console.error('💥 Connection failed:', error.message)
  }
}

testConnection()
