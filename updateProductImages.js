const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load environment variables
dotenv.config();

// Sample image URLs for products
const productImages = {
    'Classic Leather Watch': {
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
        ]
    },
    'Elegant Pearl Necklace': {
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
        ]
    },
    'Designer Sunglasses': {
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
        ]
    },
    'Leather Handbag': {
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
        ]
    },
    'Silver Cufflinks': {
        imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
        ]
    },
    'Gold Bracelet': {
        imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
        ]
    }
};

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
            console.log(`Found ${products.length} products. Updating image URLs...`);
            
            // Update each product with image URLs
            for (const product of products) {
                const imageData = productImages[product.name];
                
                if (imageData) {
                    product.imageUrl = imageData.imageUrl;
                    product.gallery = imageData.gallery;
                    await product.save();
                    console.log(`Updated image URLs for product: ${product.name}`);
                } else {
                    console.log(`No image data found for product: ${product.name}`);
                }
            }
            
            console.log('All products updated successfully');
        }
    } catch (error) {
        console.error('Error updating products:', error);
    } finally {
        mongoose.disconnect();
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
}); 