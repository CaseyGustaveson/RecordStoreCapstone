import express from 'express';
const router = express.Router();
import * as categoryController from '../controllers/categoryController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

// Middleware to parse JSON bodies
router.use(express.json());

// Routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', authenticateToken, isAdmin, categoryController.createCategory);
router.put('/:id', authenticateToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateToken, isAdmin, categoryController.deleteCategory);

export default router;
