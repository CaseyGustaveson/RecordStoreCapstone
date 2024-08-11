import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.sendStatus(403);
    }
}

const checkout = async (req, res) => {
    const { cartItems } = req.body;

    // Validate cartItems
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty cart data' });
    }

    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Process each item in the cart
        for (const item of cartItems) {
            const { productId, quantity } = item;

            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({ error: 'Invalid item data' });
            }

            const product = await prisma.product.findUnique({
                where: { id: Number(productId) }
            });

            if (!product) {
                return res.status(404).json({ error: `Product with ID ${productId} not found` });
            }

            if (product.quantity < quantity) {
                return res.status(400).json({ error: `Not enough stock for product ID ${productId}` });
            }

            await prisma.product.update({
                where: { id: Number(productId) },
                data: { quantity: product.quantity - quantity }
            });
        }

        // Clear cart items for the user
        await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });

        res.status(200).json({ message: 'Checkout successful!' });
    } catch (error) {
        console.error('Error during checkout:', error.message);  // Log error message
        res.status(500).json({ error: 'Failed to complete checkout' });
    }
};

router.post('/',authMiddleware, checkout);

export default router;
