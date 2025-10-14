const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration endpoint...');
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testData);
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Registration failed:');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 SOLUTION: Start the backend server:');
      console.log('cd backend');
      console.log('npm start');
    } else if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testRegistration();