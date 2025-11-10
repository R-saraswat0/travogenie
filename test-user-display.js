const axios = require('axios');

axios.defaults.baseURL = 'http://localhost:5001';

async function testUserDisplay() {
  console.log('🧪 Testing User Display in Navbar...\n');

  try {
    // Test 1: Register a user
    console.log('1️⃣ Creating test user...');
    const testUser = {
      name: 'John Doe',
      email: `john${Date.now()}@example.com`,
      password: 'password123'
    };

    const registerResponse = await axios.post('/api/auth/register', testUser);
    console.log('✅ User registered:', registerResponse.data.user.name);
    
    const token = registerResponse.data.token;
    console.log('✅ Token received:', token.substring(0, 20) + '...');

    // Test 2: Verify the /me endpoint works
    console.log('\n2️⃣ Testing /me endpoint...');
    const meResponse = await axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ User data from /me endpoint:');
    console.log('   Name:', meResponse.data.user.name);
    console.log('   Email:', meResponse.data.user.email);
    console.log('   ID:', meResponse.data.user.id);

    // Test 3: Login with the same user
    console.log('\n3️⃣ Testing login...');
    const loginResponse = await axios.post('/api/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log('✅ Login successful:');
    console.log('   Name:', loginResponse.data.user.name);
    console.log('   Token:', loginResponse.data.token.substring(0, 20) + '...');

    console.log('\n🎉 Backend user authentication is working correctly!');
    console.log('\n📋 For the frontend to show the name:');
    console.log('   1. Make sure you login/register through the frontend');
    console.log('   2. Check browser localStorage for the token');
    console.log('   3. The AuthContext should call /api/auth/me on app load');
    console.log('   4. The Navbar should display: "Hi, John Doe!"');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testUserDisplay();