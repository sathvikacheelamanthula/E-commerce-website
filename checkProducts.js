const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

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
        // Get all products
        const products = await Product.find({});
        
        if (products.length === 0) {
            console.log('No products found in the database');
        } else {
            console.log(`Found ${products.length} products:`);
            
            // Display product details including image URLs
            products.forEach((product, index) => {
                console.log(`\nProduct ${index + 1}:`);
                console.log(`Name: ${product.name}`);
                console.log(`Image URL: ${product.imageUrl}`);
                console.log(`Gallery URLs: ${product.gallery.join(', ') || 'None'}`);
                
                // Check if image URL is valid
                if (product.imageUrl) {
                    console.log(`Image URL format: ${product.imageUrl.startsWith('http') ? 'Valid (starts with http)' : 'Invalid (does not start with http)'}`);
                }
            });
        }
    } catch (error) {
        console.error('Error checking products:', error);
    } finally {
        mongoose.disconnect();
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
}); 