// File: src/routes/checkout.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

const checkout = async (req, res) => {
    const { cartItems } = req.body; // Expecting cart items to be sent in the request body

    if (!cartItems || !Array.isArray(cartItems)) {
        return res.status(400).json({ error: 'Invalid cart data' });
    }

    try {
        for (const item of cartItems) {
            const { productId, quantity } = item;

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

        await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });

        res.status(200).json({ message: 'Checkout successful!' });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ error: 'Failed to complete checkout' });
    }
};

router.post('/', checkout);

export default router;
