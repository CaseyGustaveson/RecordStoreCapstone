import express from 'express';
const router = express.Router();
import categoryController from '../controllers/categoryController.js';
import { isAdmin } from '../middleware/authMiddleware.js';

// Middleware to parse JSON bodies
router.use(express.json());

//routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/',isAdmin, categoryController.createCategory);
router.put('/:id',isAdmin, categoryController.updateCategory);
router.delete('/:id',isAdmin, categoryController.deleteCategory);

export default router;