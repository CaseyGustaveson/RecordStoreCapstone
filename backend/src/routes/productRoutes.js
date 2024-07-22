import express from 'express';
const router = express.Router();
import * as productController from '../controllers/productController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

// Middleware to parse JSON request body
router.use(express.json());

// Routes
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);
router.post('/', authenticateToken, isAdmin, productController.createProduct);
router.put('/:id', authenticateToken, isAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, isAdmin, productController.deleteProduct);

export default router;
