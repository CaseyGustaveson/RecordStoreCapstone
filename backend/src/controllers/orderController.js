// backend/src/controllers/orderController.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: true } // Include related order items if necessary
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: { items: true } // Include related order items if necessary
        });
        if (order) {
            res.json(order);
        } else {
            res.status(404).send('Order not found');
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const createOrder = async (req, res) => {
    const { userId, items } = req.body;
    try {
        const newOrder = await prisma.order.create({
            data: {
                userId,
                items: {
                    create: items // Assuming items is an array of order item data
                }
            }
        });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: Number(id) },
            data: { status }
        });
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.order.delete({
            where: { id: Number(id) }
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).send('Internal Server Error');
    }
};
