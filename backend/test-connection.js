const mongoose = require('mongoose');
const User = require('./models/User');

// Test MongoDB connection
async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    await mongoose.connect('mongodb://localhost:27017/travogenie', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test User model
    console.log('Testing User model...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ User model works!');
    console.log('Backend is ready for registration!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 SOLUTION: Start MongoDB service:');
      console.log('1. Install MongoDB if not installed');
      console.log('2. Start MongoDB service:');
      console.log('   - Windows: net start MongoDB');
      console.log('   - Mac: brew services start mongodb-community');
      console.log('   - Linux: sudo systemctl start mongod');
    }
  } finally {
    mongoose.connection.close();
  }
}

testConnection();