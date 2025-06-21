const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

// Clear all products (admin only)
router.delete('/clear-all', adminAuth, async (req, res) => {
    try {
        await Product.deleteMany({});
        res.json({ message: 'All products cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Replace all products (admin only)
router.post('/replace-all', adminAuth, async (req, res) => {
    try {
        // Delete all existing products
        await Product.deleteMany({});

        // New products data
        const newProducts = [
            // Featured Products
            {
                name: "Luxury Chronograph Watch",
                description: "Premium leather strap watch with chronograph function",
                price: 299.99,
                category: "watches",
                subCategory: "men",
                image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80",
                stock: 15,
                featured: true
            },
            {
                name: "Diamond Tennis Bracelet",
                description: "Sterling silver bracelet with cubic zirconia",
                price: 299.99,
                category: "jewelry",
                subCategory: "women",
                image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80",
                stock: 10,
                featured: true
            },
            {
                name: "Designer Tote Bag",
                description: "Spacious leather tote with gold hardware",
                price: 399.99,
                category: "bags",
                subCategory: "women",
                image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80",
                stock: 8,
                featured: true
            },
            {
                name: "Aviator Sunglasses",
                description: "Classic aviator style with UV protection",
                price: 149.99,
                category: "sunglasses",
                subCategory: "men",
                image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80",
                stock: 20,
                featured: true
            },
            {
                name: "Leather Belt",
                description: "Genuine leather belt with silver buckle",
                price: 79.99,
                category: "belts",
                subCategory: "men",
                image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80",
                stock: 25,
                featured: true
            },
            {
                name: "Pearl Necklace",
                description: "Elegant freshwater pearl necklace",
                price: 249.99,
                category: "jewelry",
                subCategory: "women",
                image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80",
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
                image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80",
                stock: 18,
                featured: false
            },
            {
                name: "Leather Wallet",
                description: "Compact leather wallet with RFID protection",
                price: 89.99,
                category: "wallets",
                subCategory: "men",
                image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80",
                stock: 30,
                featured: false
            },
            {
                name: "Men's Bracelet",
                description: "Sterling silver bracelet with modern design",
                price: 129.99,
                category: "jewelry",
                subCategory: "men",
                image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80",
                stock: 15,
                featured: false
            },
            {
                name: "Baseball Cap",
                description: "Classic baseball cap with embroidered logo",
                price: 39.99,
                category: "caps",
                subCategory: "men",
                image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80",
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
                image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80",
                stock: 10,
                featured: false
            },
            {
                name: "Designer Handbag",
                description: "Luxury leather handbag with gold hardware",
                price: 499.99,
                category: "bags",
                subCategory: "women",
                image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80",
                stock: 5,
                featured: false
            },
            {
                name: "Silk Scarf",
                description: "Elegant silk scarf with floral pattern",
                price: 89.99,
                category: "scarves",
                subCategory: "women",
                image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80",
                stock: 20,
                featured: false
            },
            {
                name: "Diamond Ring",
                description: "Classic solitaire diamond ring",
                price: 599.99,
                category: "jewelry",
                subCategory: "women",
                image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80",
                stock: 8,
                featured: false
            },
            {
                name: "Hair Clip Set",
                description: "Set of 3 decorative hair clips",
                price: 29.99,
                category: "hair-accessories",
                subCategory: "women",
                image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80",
                stock: 25,
                featured: false
            }
        ];

        // Insert new products
        const insertedProducts = await Product.insertMany(newProducts);
        res.status(201).json({
            message: 'All products replaced successfully',
            products: insertedProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category, subCategory, featured } = req.query;
        let query = {};

        if (category) query.category = category;
        if (subCategory) query.subCategory = subCategory;
        if (featured) query.featured = featured === 'true';

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create product (admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 