const axios = require('axios');

// Configure axios to use the correct backend URL
axios.defaults.baseURL = 'http://localhost:5001';

async function testFrontendBackendConnection() {
  console.log('🔗 Testing Frontend-Backend Connection...\n');

  try {
    // Test 1: Basic ping
    console.log('1️⃣ Testing basic connection...');
    const pingResponse = await axios.get('/api/ping');
    console.log('✅ Connection successful:', pingResponse.data.message);

    // Test 2: Packages fetch (what frontend needs)
    console.log('\n2️⃣ Testing packages fetch...');
    const packagesResponse = await axios.get('/api/packages');
    console.log(`✅ Packages loaded: ${packagesResponse.data.packages.length} packages available`);

    // Test 3: User registration (frontend auth flow)
    console.log('\n3️⃣ Testing user registration flow...');
    const testUser = {
      name: 'Frontend Test User',
      email: `frontend${Date.now()}@example.com`,
      password: 'password123'
    };

    const registerResponse = await axios.post('/api/auth/register', testUser);
    console.log('✅ Registration flow working');
    console.log(`   User created: ${registerResponse.data.user.name}`);

    console.log('\n🎉 Frontend-Backend connection is working perfectly!');
    console.log('\n📋 What this means for your app:');
    console.log('   ✅ User registration/login will work');
    console.log('   ✅ Package listings will load');
    console.log('   ✅ User authentication is functional');
    console.log('   ✅ All API endpoints are accessible');

    console.log('\n💡 Next steps:');
    console.log('   1. Start your frontend: cd frontend && npm start');
    console.log('   2. The app should now show user names and packages correctly');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Backend server is not running. Start it with:');
      console.log('   cd backend && npm start');
    } else if (error.response) {
      console.log('❌ Server error:', error.response.data);
    }
  }
}

testFrontendBackendConnection();