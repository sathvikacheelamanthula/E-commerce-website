const mongoose = require('mongoose');
const BaseModel = require('./BaseModel');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['watches', 'jewelry', 'bags', 'sunglasses', 'belts', 'wallets', 'caps', 'scarves', 'hair-accessories']
    },
    subCategory: {
        type: String,
        required: true,
        enum: ['men', 'women']
    },
    image: {
        type: String,
        required: true
    },
    gallery: {
        type: [String],
        default: []
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create Product model using BaseModel
class ProductModel extends BaseModel {
    constructor() {
        super(productSchema, 'Product');
    }
    
    // Add product-specific methods here
    async findFeatured() {
        return await this.getModel().find({ featured: true });
    }
    
    async findByCategory(category) {
        return await this.getModel().find({ category });
    }
    
    async findBySubCategory(subCategory) {
        return await this.getModel().find({ subCategory });
    }
    
    async updateStock(id, quantity) {
        const product = await this.getModel().findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        
        if (product.stock + quantity < 0) {
            throw new Error('Insufficient stock');
        }
        
        product.stock += quantity;
        return await product.save();
    }
}

// Export a singleton instance
module.exports = new ProductModel().getModel(); 