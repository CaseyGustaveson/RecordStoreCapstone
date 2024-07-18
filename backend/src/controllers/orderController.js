import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany();
        res.status(200).json(orders);
    } catch (error) {
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
