const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
    // Featured Products - Men's
    {
        name: "Luxury Chronograph Watch",
        description: "Premium leather strap watch with chronograph function",
        price: 299.99,
        category: "watches",
        subCategory: "men",
        image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=300&q=80",
        stock: 15,
        featured: true
    },
    {
        name: "Classic Leather Belt",
        description: "Genuine leather belt with silver buckle",
        price: 79.99,
        category: "belts",
        subCategory: "men",
        image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=300&q=80",
        stock: 25,
        featured: true
    },
    {
        name: "Aviator Sunglasses",
        description: "Classic aviator style with UV protection",
        price: 149.99,
        category: "sunglasses",
        subCategory: "men",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80",
        stock: 20,
        featured: true
    },
    // Featured Products - Women's
    {
        name: "Diamond Tennis Bracelet",
        description: "Sterling silver bracelet with cubic zirconia",
        price: 299.99,
        category: "jewelry",
        subCategory: "women",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80",
        stock: 10,
        featured: true
    },
    {
        name: "Designer Tote Bag",
        description: "Spacious leather tote with gold hardware",
        price: 399.99,
        category: "bags",
        subCategory: "women",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80",
        stock: 8,
        featured: true
    },
    {
        name: "Pearl Necklace",
        description: "Elegant freshwater pearl necklace",
        price: 249.99,
        category: "jewelry",
        subCategory: "women",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
        stock: 12,
        featured: true
    },
    // Men's Accessories
    {
        name: "Smart Watch",
        description: "Modern smartwatch with health tracking",
        price: 299.99,
        category: "watches",
        subCategory: "men",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80",
        stock: 18,
        featured: false
    },
    {
        name: "Leather Wallet",
        description: "Compact leather wallet with RFID protection",
        price: 89.99,
        category: "wallets",
        subCategory: "men",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80",
        stock: 30,
        featured: false
    },
    {
        name: "Men's Bracelet",
        description: "Sterling silver bracelet with modern design",
        price: 129.99,
        category: "jewelry",
        subCategory: "men",
        image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=300&q=80",
        stock: 15,
        featured: false
    },
    {
        name: "Baseball Cap",
        description: "Classic baseball cap with embroidered logo",
        price: 39.99,
        category: "caps",
        subCategory: "men",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=300&q=80",
        stock: 40,
        featured: false
    },
    // Women's Accessories
    {
        name: "Diamond Earrings",
        description: "Elegant diamond stud earrings",
        price: 199.99,
        category: "jewelry",
        subCategory: "women",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
        stock: 10,
        featured: false
    },
    {
        name: "Designer Handbag",
        description: "Luxury leather handbag with gold hardware",
        price: 499.99,
        category: "bags",
        subCategory: "women",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80",
        stock: 5,
        featured: false
    },
    {
        name: "Silk Scarf",
        description: "Elegant silk scarf with floral pattern",
        price: 89.99,
        category: "scarves",
        subCategory: "women",
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=300&q=80",
        stock: 20,
        featured: false
    },
    {
        name: "Diamond Ring",
        description: "Classic solitaire diamond ring",
        price: 599.99,
        category: "jewelry",
        subCategory: "women",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80",
        stock: 8,
        featured: false
    },
    {
        name: "Hair Clip Set",
        description: "Set of 3 decorative hair clips",
        price: 29.99,
        category: "hair-accessories",
        subCategory: "women",
        image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=300&q=80",
        stock: 25,
        featured: false
    }
];

async function seedProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/everywear');
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        const insertedProducts = await Product.insertMany(products);
        console.log(`Successfully inserted ${insertedProducts.length} products`);

        // Log featured products
        const featuredProducts = insertedProducts.filter(p => p.featured);
        console.log('\nFeatured Products:');
        featuredProducts.forEach(p => console.log(`- ${p.name} (${p.category})`));

        // Log products by category
        const categories = [...new Set(insertedProducts.map(p => p.category))];
        console.log('\nProducts by Category:');
        categories.forEach(category => {
            const count = insertedProducts.filter(p => p.category === category).length;
            console.log(`- ${category}: ${count} products`);
        });

        await mongoose.disconnect();
        console.log('\nDatabase seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedProducts(); 