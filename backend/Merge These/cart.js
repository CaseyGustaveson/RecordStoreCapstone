import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.sendStatus(403);
    }
};

// API URL for cart operations
const API_URL = '/api/cart';

// API Functions
const getCart = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        return null;
    }
};

const addToCart = async (productId, quantity) => {
    try {
        const response = await axios.post(API_URL, { productId, quantity });
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return null;
    }
};

const updateCartItem = async (itemId, quantity) => {
    try {
        const response = await axios.put(`${API_URL}/${itemId}`, { quantity });
        return response.data;
    } catch (error) {
        console.error('Error updating cart item:', error);
        return null;
    }
};

const removeCartItem = async (itemId) => {
    try {
        const response = await axios.delete(`${API_URL}/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing cart item:', error);
        return null;
    }
};

const clearCart = async () => {
    try {
        const response = await axios.delete(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error clearing cart:', error);
        return null;
    }
};

const checkoutCart = async () => {
    try {
        const response = await axios.post(`${API_URL}/checkout`);
        return response.data;
    } catch (error) {
        console.error('Error checking out cart:', error);
        return null;
    }
};

// Cart Routes
router.get('/cart', authenticateToken, async (req, res) => {
    const cart = await getCart();
    res.json(cart);
});

router.post('/cart', authenticateToken, async (req, res) => {
    const { productId, quantity } = req.body;
    const result = await addToCart(productId, quantity);
    res.json(result);
});

router.put('/cart/:itemId', authenticateToken, async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const result = await updateCartItem(itemId, quantity);
    res.json(result);
});

router.delete('/cart/:itemId', authenticateToken, async (req, res) => {
    const { itemId } = req.params;
    const result = await removeCartItem(itemId);
    res.json(result);
});

router.delete('/cart', authenticateToken, async (req, res) => {
    const result = await clearCart();
    res.json(result);
});

router.post('/cart/checkout', authenticateToken, async (req, res) => {
    const result = await checkoutCart();
    res.json(result);
});

export default router;
