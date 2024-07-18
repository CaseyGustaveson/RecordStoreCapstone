import express from 'express';
const router = express.Router();
import orderController from '../controllers/orderController.js'; // Include .js extension
import { isAdmin } from '../middleware/authMiddleware.js';

// Middleware to parse JSON bodies
router.use(express.json());

// Routes
router.get('/', orderController.getOrders);
router.get('/:id', isAdmin, orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', isAdmin, orderController.deleteOrder);

export default router;
