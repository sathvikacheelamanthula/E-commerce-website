const express = require('express');
const router = express.Router();
const cartService = require('../services/cartService');
const { auth } = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        const cart = await cartService.getOrCreateCart(req.user._id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const cart = await cartService.addToCart(req.user._id, productId, quantity);
        res.json(cart);
    } catch (error) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes('stock')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// Update cart item quantity
router.put('/update', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await cartService.updateCartItem(req.user._id, productId, quantity);
        res.json(cart);
    } catch (error) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes('stock') || error.message.includes('negative')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
    try {
        const cart = await cartService.removeFromCart(req.user._id, req.params.productId);
        res.json(cart);
    } catch (error) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
    try {
        const cart = await cartService.clearCart(req.user._id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 