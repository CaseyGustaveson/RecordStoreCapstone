import express from 'express';
const router = express.Router();
import productController from '../controllers/productController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

// Middleware to parse JSON request body
router.use(express.json());

// Routes
router.get('/', authenticateToken, isAdmin, productController.getProducts);
router.get('/search', authenticateToken, productController.searchProducts);
router.get('/:id', authenticateToken, productController.getProductById);
router.post('/', authenticateToken, isAdmin, productController.createProduct);
router.put('/:id', authenticateToken, isAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, isAdmin, productController.deleteProduct);

export default router;
