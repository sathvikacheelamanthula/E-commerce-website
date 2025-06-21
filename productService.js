const Product = require('../models/Product');
const BaseModel = require('../models/BaseModel');

class ProductService {
    /**
     * Get all products with optional filtering
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} - Array of products
     */
    async getAllProducts(filters = {}) {
        try {
            const query = {};
            
            // Apply filters
            if (filters.category) {
                query.category = filters.category;
            }
            
            if (filters.subCategory) {
                query.subCategory = filters.subCategory;
            }
            
            if (filters.featured !== undefined) {
                query.featured = filters.featured;
            }
            
            if (filters.maxPrice) {
                query.price = { $lte: filters.maxPrice };
            }
            
            // Apply sorting
            const sortOptions = {};
            if (filters.sortBy) {
                switch (filters.sortBy) {
                    case 'price-low':
                        sortOptions.price = 1;
                        break;
                    case 'price-high':
                        sortOptions.price = -1;
                        break;
                    case 'name':
                        sortOptions.name = 1;
                        break;
                    case 'newest':
                        sortOptions.createdAt = -1;
                        break;
                    default:
                        sortOptions.createdAt = -1;
                }
            }
            
            return await BaseModel.find(Product, query, { sort: sortOptions });
        } catch (error) {
            throw new Error(`Error getting products: ${error.message}`);
        }
    }
    
    /**
     * Get a product by ID
     * @param {string} id - Product ID
     * @returns {Promise<Object>} - Product object
     */
    async getProductById(id) {
        try {
            const product = await BaseModel.findById(Product, id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error(`Error getting product: ${error.message}`);
        }
    }
    
    /**
     * Create a new product
     * @param {Object} productData - Product data
     * @returns {Promise<Object>} - Created product
     */
    async createProduct(productData) {
        try {
            return await BaseModel.create(Product, productData);
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }
    
    /**
     * Update a product
     * @param {string} id - Product ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} - Updated product
     */
    async updateProduct(id, updateData) {
        try {
            const product = await BaseModel.update(Product, id, updateData);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }
    
    /**
     * Delete a product
     * @param {string} id - Product ID
     * @returns {Promise<Object>} - Deleted product
     */
    async deleteProduct(id) {
        try {
            const product = await BaseModel.delete(Product, id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }
    
    /**
     * Update product stock
     * @param {string} id - Product ID
     * @param {number} quantity - Quantity to add/subtract
     * @returns {Promise<Object>} - Updated product
     */
    async updateStock(id, quantity) {
        try {
            const product = await Product.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            
            if (product.stock + quantity < 0) {
                throw new Error('Insufficient stock');
            }
            
            product.stock += quantity;
            return await product.save();
        } catch (error) {
            throw new Error(`Error updating stock: ${error.message}`);
        }
    }
}

module.exports = new ProductService(); 