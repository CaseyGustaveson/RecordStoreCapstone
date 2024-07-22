import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Middleware to parse JSON request body
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

// API Functions for Orders
const getOrders = async () => {
    return await prisma.order.findMany();
};

const getOrder = async (orderId) => {
    return await prisma.order.findUnique({
        where: { id: Number(orderId) }
    });
};

const createOrder = async (order) => {
    return await prisma.order.create({ data: order });
};

const updateOrder = async (orderId, order) => {
    return await prisma.order.update({
        where: { id: Number(orderId) },
        data: order
    });
};

const deleteOrder = async (orderId) => {
    return await prisma.order.delete({
        where: { id: Number(orderId) }
    });
};

const completeOrder = async (orderId) => {
    return await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: 'completed' }
    });
};

const cancelOrder = async (orderId) => {
    return await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: 'canceled' }
    });
};

// Route handlers for orders
router.get('/orders', authenticateToken, isAdmin, async (req, res) => {
    const orders = await getOrders();
    res.json(orders);
});

router.get('/orders/:id', authenticateToken, isAdmin, async (req, res) => {
    const orderId = req.params.id;
    const order = await getOrder(orderId);
    res.json(order);
});

router.post('/orders', async (req, res) => {
    const order = req.body;
    const newOrder = await createOrder(order);
    res.json(newOrder);
});

router.put('/orders/:id', authenticateToken, isAdmin, async (req, res) => {
    const orderId = req.params.id;
    const order = req.body;
    const updatedOrder = await updateOrder(orderId, order);
    res.json(updatedOrder);
});

router.delete('/orders/:id', authenticateToken, isAdmin, async (req, res) => {
    const orderId = req.params.id;
    const deletedOrder = await deleteOrder(orderId);
    res.json(deletedOrder);
});

router.post('/orders/:id/complete', authenticateToken, isAdmin, async (req, res) => {
    const orderId = req.params.id;
    const completedOrder = await completeOrder(orderId);
    res.json(completedOrder);
});

router.post('/orders/:id/cancel', authenticateToken, isAdmin, async (req, res) => {
    const orderId = req.params.id;
    const canceledOrder = await cancelOrder(orderId);
    res.json(canceledOrder);
});

export default router;
