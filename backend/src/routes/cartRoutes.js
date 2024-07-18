import express from 'express';
const router = express.Router();
import cartController from '../controllers/cartController.js';

// Middleware to parse JSON bodies
router.use(express.json());

//routes
router.get('/', cartController.getCartItems);
router.post('/', cartController.addItemToCart);
router.put('/:id', cartController.updateCartItem);
router.delete('/:id', cartController.deleteCartItem);
router.delete('/', cartController.clearCart);

export default router;