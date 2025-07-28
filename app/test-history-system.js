
const fetch = require('node-fetch');

const baseUrl = 'http://localhost:3000';

async function testHistorySystem() {
  console.log('🧪 Testing Content History System...\n');

  try {
    // Step 1: Login to get session
    console.log('1️⃣ Testing authentication...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john@doe.com',
        password: 'johndoe123'
      })
    });
    
    console.log('   Auth response status:', loginResponse.status);
    
    // Step 2: Get existing content to edit
    console.log('\n2️⃣ Finding existing content...');
    const contentsResponse = await fetch(`${baseUrl}/api/contents`);
    
    if (contentsResponse.ok) {
      const contents = await contentsResponse.json();
      console.log('   Found', contents.length, 'content(s)');
      
      if (contents.length > 0) {
        const contentId = contents[0].id;
        console.log('   Using content ID:', contentId);
        
        // Step 3: Test editing content to create history
        console.log('\n3️⃣ Testing content edit with history...');
        const editData = {
          title: `Updated Title - ${new Date().toISOString()}`,
          description: 'Updated description for history test',
          caption: 'Updated caption',
          contentType: contents[0].contentType,
          platforms: contents[0].platforms,
          mediaUrls: contents[0].mediaUrls || [],
          assigneeId: contents[0].assigneeId,
          changeReason: 'Testing the new history system functionality'
        };
        
        const editResponse = await fetch(`${baseUrl}/api/contents/${contentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editData)
        });
        
        console.log('   Edit response status:', editResponse.status);
        
        if (editResponse.ok) {
          const result = await editResponse.json();
          console.log('   ✅ History created:', result.historyCreated);
          console.log('   📝 History version:', result.historyVersion);
          console.log('   🔄 Changed fields:', result.changedFields);
          
          // Step 4: Test history API
          console.log('\n4️⃣ Testing history API...');
          const historyResponse = await fetch(`${baseUrl}/api/contents/${contentId}/history`);
          
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            console.log('   ✅ History API works!');
            console.log('   📚 Total versions:', historyData.totalVersions);
            console.log('   📋 History records:', historyData.history.length);
            
            if (historyData.history.length > 0) {
              const latestChange = historyData.history[0];
              console.log('   🎯 Latest change:');
              console.log('     - Version:', latestChange.version);
              console.log('     - Changed by:', latestChange.changedBy.name);
              console.log('     - Reason:', latestChange.changeReason);
              console.log('     - Fields:', latestChange.changedFields.join(', '));
              console.log('     - Summary:', latestChange.summary.slice(0, 2).join('; '));
            }
          } else {
            console.log('   ❌ History API failed:', historyResponse.status);
          }
        } else {
          console.log('   ❌ Content edit failed:', editResponse.status);
        }
      } else {
        console.log('   ⚠️ No content found to test with');
      }
    } else {
      console.log('   ❌ Failed to fetch contents:', contentsResponse.status);
    }
    
    console.log('\n🎉 History system test completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testHistorySystem();
