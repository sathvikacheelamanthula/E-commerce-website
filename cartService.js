const Cart = require('../models/Cart');
const Product = require('../models/Product');
const BaseModel = require('../models/BaseModel');

class CartService {
    /**
     * Get or create cart for user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} - Cart object
     */
    async getOrCreateCart(userId) {
        try {
            let cart = await Cart.findOne({ user: userId });
            
            if (!cart) {
                cart = await BaseModel.create(Cart, {
                    user: userId,
                    items: [],
                    total: 0
                });
            }
            
            return cart;
        } catch (error) {
            throw new Error(`Error getting cart: ${error.message}`);
        }
    }
    
    /**
     * Add item to cart
     * @param {string} userId - User ID
     * @param {string} productId - Product ID
     * @param {number} quantity - Quantity to add
     * @returns {Promise<Object>} - Updated cart
     */
    async addToCart(userId, productId, quantity = 1) {
        try {
            // Get product
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            
            // Check stock
            if (product.stock < quantity) {
                throw new Error('Insufficient stock');
            }
            
            // Get or create cart
            let cart = await this.getOrCreateCart(userId);
            
            // Check if product already in cart
            const existingItem = cart.items.find(item => 
                item.product.toString() === productId
            );
            
            if (existingItem) {
                // Update quantity if product exists
                existingItem.quantity += quantity;
            } else {
                // Add new item
                cart.items.push({
                    product: productId,
                    quantity,
                    price: product.price
                });
            }
            
            // Update total
            cart.total = cart.items.reduce((total, item) => 
                total + (item.price * item.quantity), 0
            );
            
            // Save cart
            cart = await cart.save();
            
            return cart;
        } catch (error) {
            throw new Error(`Error adding to cart: ${error.message}`);
        }
    }
    
    /**
     * Update cart item quantity
     * @param {string} userId - User ID
     * @param {string} productId - Product ID
     * @param {number} quantity - New quantity
     * @returns {Promise<Object>} - Updated cart
     */
    async updateCartItem(userId, productId, quantity) {
        try {
            if (quantity < 0) {
                throw new Error('Quantity cannot be negative');
            }
            
            // Get product
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            
            // Check stock
            if (product.stock < quantity) {
                throw new Error('Insufficient stock');
            }
            
            // Get cart
            const cart = await this.getOrCreateCart(userId);
            
            // Find item
            const itemIndex = cart.items.findIndex(item => 
                item.product.toString() === productId
            );
            
            if (itemIndex === -1) {
                throw new Error('Item not found in cart');
            }
            
            if (quantity === 0) {
                // Remove item if quantity is 0
                cart.items.splice(itemIndex, 1);
            } else {
                // Update quantity
                cart.items[itemIndex].quantity = quantity;
            }
            
            // Update total
            cart.total = cart.items.reduce((total, item) => 
                total + (item.price * item.quantity), 0
            );
            
            // Save cart
            const updatedCart = await cart.save();
            
            return updatedCart;
        } catch (error) {
            throw new Error(`Error updating cart: ${error.message}`);
        }
    }
    
    /**
     * Remove item from cart
     * @param {string} userId - User ID
     * @param {string} productId - Product ID
     * @returns {Promise<Object>} - Updated cart
     */
    async removeFromCart(userId, productId) {
        try {
            // Get cart
            const cart = await this.getOrCreateCart(userId);
            
            // Remove item
            cart.items = cart.items.filter(item => 
                item.product.toString() !== productId
            );
            
            // Update total
            cart.total = cart.items.reduce((total, item) => 
                total + (item.price * item.quantity), 0
            );
            
            // Save cart
            const updatedCart = await cart.save();
            
            return updatedCart;
        } catch (error) {
            throw new Error(`Error removing from cart: ${error.message}`);
        }
    }
    
    /**
     * Clear cart
     * @param {string} userId - User ID
     * @returns {Promise<Object>} - Empty cart
     */
    async clearCart(userId) {
        try {
            const cart = await this.getOrCreateCart(userId);
            
            cart.items = [];
            cart.total = 0;
            
            const updatedCart = await cart.save();
            
            return updatedCart;
        } catch (error) {
            throw new Error(`Error clearing cart: ${error.message}`);
        }
    }
}

module.exports = new CartService(); 