import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

// Middleware for Authentication
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) return res.sendStatus(403);

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.sendStatus(403);
    }
};

// Controller functions
const getCartItems = async (req, res) => {
    try {
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: req.user.id },
            include: { product: true }
        });
        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.sendStatus(500);
    }
};

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const existingCartItem = await prisma.cartItem.findFirst({
            where: { userId: req.user.id, productId: productId }
        });

        if (existingCartItem) {
            // Update existing cart item
            const updatedItem = await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity }
            });
            res.json(updatedItem);
        } else {
            // Add new cart item
            const newCartItem = await prisma.cartItem.create({
                data: { userId: req.user.id, productId: productId, quantity: quantity }
            });
            res.json(newCartItem);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.sendStatus(500);
    }
};

const updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    try {
        const updatedCartItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: quantity }
        });
        res.json(updatedCartItem);
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.sendStatus(500);
    }
};

const removeCartItem = async (req, res) => {
    const { itemId } = req.params;

    try {
        await prisma.cartItem.delete({
            where: { id: itemId }
        });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error removing cart item:', error);
        res.sendStatus(500);
    }
};

const clearCart = async (req, res) => {
    try {
        await prisma.cartItem.deleteMany({
            where: { userId: req.user.id }
        });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.sendStatus(500);
    }
};

const checkoutCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: userId }
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const order = await prisma.order.create({
            data: {
                userId: userId,
                orderItems: {
                    create: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity
                    }))
                }
            }
        });

        await prisma.cartItem.deleteMany({
            where: { userId: userId }
        });

        res.json(order);
    } catch (error) {
        console.error('Error checking out cart:', error);
        res.sendStatus(500);
    }
};

// Define routes directly in the file
router.get('/cart', authenticateToken, getCartItems);
router.post('/cart', authenticateToken, addToCart);
router.put('/cart/:itemId', authenticateToken, updateCartItem);
router.delete('/cart/:itemId', authenticateToken, removeCartItem);
router.delete('/cart', authenticateToken, clearCart);
router.post('/cart/checkout', authenticateToken, checkoutCart);

export default router;
