import { PrismaClient } from '@prisma/client';
<<<<<<< HEAD
const prisma = new PrismaClient();

const getOrders = async (req, res) => {
=======

const prisma = new PrismaClient();

export const getOrders = async (req, res) => {
>>>>>>> b74b19b (do-over)
    try {
        const orders = await prisma.order.findMany();
        res.status(200).json(orders);
    } catch (error) {
<<<<<<< HEAD
        console.error('Error getting orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
        });
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
        } else {
            res.status(200).json(order);
        }
    } catch (error) {
        console.error('Error getting order by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createOrder = async (req, res) => {
    try {
        const { userId, totalAmount, items } = req.body;
        const newOrder = await prisma.order.create({
            data: { userId, totalAmount, items: { create: items } },
        });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { totalAmount, items } = req.body;
        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { totalAmount, items: { update: items } },
        });
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.order.delete({ where: { id: parseInt(id) } });
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };
=======
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

export const createOrder = async (req, res) => {
    const { userId, productIds, totalAmount } = req.body;
    try {
        const order = await prisma.order.create({
            data: {
                userId,
                productIds,
                totalAmount,
                // Add other order fields as needed
            },
        });
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status, totalAmount } = req.body;
    try {
        const order = await prisma.order.update({
            where: { id: Number(id) },
            data: {
                status,
                totalAmount,
                // Update other fields as needed
            },
        });
        res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.order.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
>>>>>>> b74b19b (do-over)
