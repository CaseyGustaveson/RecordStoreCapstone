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

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.sendStatus(403);
    }
};

// Controller functions
const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.sendStatus(500);
    }
};

const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(id) }
        });
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.sendStatus(500);
    }
};

const createOrder = async (req, res) => {
    try {
        const newOrder = await prisma.order.create({
            data: req.body
        });
        res.json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.sendStatus(500);
    }
};

const updateOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: Number(id) },
            data: req.body
        });
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.sendStatus(500);
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await prisma.order.delete({
            where: { id: Number(id) }
        });
        res.json(deletedOrder);
    } catch (error) {
        console.error('Error deleting order:', error);
        res.sendStatus(500);
    }
};

const completeOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const completedOrder = await prisma.order.update({
            where: { id: Number(id) },
            data: { status: 'completed' }
        });
        res.json(completedOrder);
    } catch (error) {
        console.error('Error completing order:', error);
        res.sendStatus(500);
    }
};

const cancelOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const canceledOrder = await prisma.order.update({
            where: { id: Number(id) },
            data: { status: 'canceled' }
        });
        res.json(canceledOrder);
    } catch (error) {
        console.error('Error canceling order:', error);
        res.sendStatus(500);
    }
};

// Define routes directly in the file
router.get('/orders', authenticateToken, isAdmin, getAllOrders);
router.get('/orders/:id', authenticateToken, isAdmin, getOrderById);
router.post('/orders', createOrder);
router.put('/orders/:id', authenticateToken, isAdmin, updateOrder);
router.delete('/orders/:id', authenticateToken, isAdmin, deleteOrder);
router.post('/orders/:id/complete', authenticateToken, isAdmin, completeOrder);
router.post('/orders/:id/cancel', authenticateToken, isAdmin, cancelOrder);

export default router;
