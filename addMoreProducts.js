const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load environment variables
dotenv.config();

// New products data
const newProducts = [
    // Men's Watches
    {
        name: "Luxury Chronograph Watch",
        description: "Premium stainless steel chronograph watch with leather strap and automatic movement",
        price: 299.99,
        category: "men",
        subCategory: "watches",
        imageUrl: "https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 15,
        featured: true
    },
    {
        name: "Smart Digital Watch",
        description: "Modern digital watch with fitness tracking and smartphone notifications",
        price: 179.99,
        category: "men",
        subCategory: "watches",
        imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 20
    },

    // Women's Watches
    {
        name: "Rose Gold Watch",
        description: "Elegant rose gold watch with mother of pearl dial",
        price: 249.99,
        category: "women",
        subCategory: "watches",
        imageUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 12,
        featured: true
    },
    {
        name: "Minimalist Watch",
        description: "Simple and elegant watch with mesh strap",
        price: 159.99,
        category: "women",
        subCategory: "watches",
        imageUrl: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 18
    },

    // Men's Sunglasses
    {
        name: "Aviator Sunglasses",
        description: "Classic aviator sunglasses with polarized lenses",
        price: 129.99,
        category: "men",
        subCategory: "sunglasses",
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 25
    },
    {
        name: "Sports Sunglasses",
        description: "Durable sports sunglasses with UV protection",
        price: 89.99,
        category: "men",
        subCategory: "sunglasses",
        imageUrl: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 30
    },

    // Women's Sunglasses
    {
        name: "Cat Eye Sunglasses",
        description: "Vintage-inspired cat eye sunglasses with gradient lenses",
        price: 119.99,
        category: "women",
        subCategory: "sunglasses",
        imageUrl: "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 20
    },
    {
        name: "Oversized Sunglasses",
        description: "Trendy oversized sunglasses with UV400 protection",
        price: 99.99,
        category: "women",
        subCategory: "sunglasses",
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 22
    },

    // Men's Jewelry
    {
        name: "Leather Bracelet",
        description: "Braided leather bracelet with stainless steel clasp",
        price: 49.99,
        category: "men",
        subCategory: "jewelry",
        imageUrl: "https://images.unsplash.com/photo-1591209662757-0a9f4d4dfb9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1591209662757-0a9f4d4dfb9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 35
    },
    {
        name: "Steel Chain Necklace",
        description: "Modern stainless steel chain necklace",
        price: 79.99,
        category: "men",
        subCategory: "jewelry",
        imageUrl: "https://images.unsplash.com/photo-1612696733290-a2a26e9ddbd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1612696733290-a2a26e9ddbd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 25
    },

    // Women's Jewelry
    {
        name: "Diamond Pendant",
        description: "Elegant diamond pendant with 18k gold chain",
        price: 399.99,
        category: "women",
        subCategory: "jewelry",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 10,
        featured: true
    },
    {
        name: "Crystal Earrings",
        description: "Sparkling crystal drop earrings",
        price: 89.99,
        category: "women",
        subCategory: "jewelry",
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 15
    },

    // Men's Bags
    {
        name: "Leather Messenger Bag",
        description: "Professional leather messenger bag with laptop compartment",
        price: 199.99,
        category: "men",
        subCategory: "bags",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 18
    },
    {
        name: "Canvas Backpack",
        description: "Durable canvas backpack with leather trim",
        price: 149.99,
        category: "men",
        subCategory: "bags",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 20
    },

    // Women's Bags
    {
        name: "Designer Tote Bag",
        description: "Spacious designer tote with genuine leather finish",
        price: 279.99,
        category: "women",
        subCategory: "bags",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 12,
        featured: true
    },
    {
        name: "Crossbody Bag",
        description: "Compact crossbody bag with adjustable strap",
        price: 129.99,
        category: "women",
        subCategory: "bags",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ],
        stock: 25
    }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/everywear', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Add all new products
        for (const productData of newProducts) {
            const product = new Product(productData);
            await product.save();
            console.log(`Added product: ${product.name}`);
        }
        
        console.log('All new products added successfully');
    } catch (error) {
        console.error('Error adding products:', error);
    } finally {
        mongoose.disconnect();
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
}); 