const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/everywear', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Check if test user already exists
        const existingUser = await User.findOne({ email: 'test@example.com' });
        
        if (existingUser) {
            console.log('Test user already exists');
            process.exit(0);
        }
        
        // Create test user
        const testUser = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'user'
        });
        
        await testUser.save();
        console.log('Test user created successfully');
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        mongoose.disconnect();
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
}); 