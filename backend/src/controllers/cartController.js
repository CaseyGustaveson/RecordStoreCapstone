import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getCartItems = async (req, res) => {
    try {
        const cartItems = await prisma.cart.findMany({
            where: { userId: req.user.id }, 
            include: { item: true }, // Include related item details
        });
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error getting cart items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addItemToCart = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const cartItem = await prisma.cart.create({
            data: {
                userId: req.user.id,
                itemId,
                quantity,
            },
            include: { item: true }, // Include related item details
        });
        res.status(201).json(cartItem);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const updatedCartItem = await prisma.cart.update({
            where: { id: parseInt(id) },
            data: { quantity },
            include: { item: true }, // Include related item details
        });
        res.status(200).json(updatedCartItem);
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.cart.delete({ where: { id: parseInt(id) } });
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const clearCart = async (req, res) => {
    try {
        await prisma.cart.deleteMany({ where: { userId: req.user.id } });
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting cart items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default { getCartItems, addItemToCart, updateCartItem, deleteCartItem, clearCart };