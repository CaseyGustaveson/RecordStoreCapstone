// backend/src/routes/orderRoutes.js

import express from 'express';
const router = express.Router();
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../controllers/orderController.js';
import { isAdmin } from '../middleware/authMiddleware.js';

// Middleware to parse JSON bodies
router.use(express.json());

// Routes
router.get('/', getOrders);
router.get('/:id', isAdmin, getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', isAdmin, deleteOrder);

export default router;
