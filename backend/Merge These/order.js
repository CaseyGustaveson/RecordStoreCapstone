import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const router = express.Router();

// Middleware to parse JSON request body
router.use(express.json());

// Middleware functions
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

// API URL
const API_URL = '/api/order';

// API functions
const getOrders = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return null;
    }
};

const getOrder = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
};

const createOrder = async (order) => {
    try {
        const response = await axios.post(API_URL, order);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
};

const updateOrder = async (orderId, order) => {
    try {
        const response = await axios.put(`${API_URL}/${orderId}`, order);
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        return null;
    }
};

const deleteOrder = async (orderId) => {
    try {
        const response = await axios.delete(`${API_URL}/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting order:', error);
        return null;
    }
};

const completeOrder = async (orderId) => {
    try {
        const response = await axios.post(`${API_URL}/${orderId}/complete`);
        return response.data;
    } catch (error) {
        console.error('Error completing order:', error);
        return null;
    }
};

const cancelOrder = async (orderId) => {
    try {
        const response = await axios.post(`${API_URL}/${orderId}/cancel`);
        return response.data;
    } catch (error) {
        console.error('Error canceling order:', error);
        return null;
    }
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
