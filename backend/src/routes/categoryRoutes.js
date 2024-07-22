import express from 'express';
<<<<<<< HEAD
const router = express.Router();
import * as categoryController from '../controllers/categoryController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

// Middleware to parse JSON bodies
=======
import * as categoryController from '../controllers/categoryController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to parse JSON request body
>>>>>>> b74b19b (do-over)
router.use(express.json());

// Routes
router.get('/', categoryController.getCategories);
<<<<<<< HEAD
router.get('/:id', categoryController.getCategoryById);
=======
router.get('/:id', categoryController.getCategory);
>>>>>>> b74b19b (do-over)
router.post('/', authenticateToken, isAdmin, categoryController.createCategory);
router.put('/:id', authenticateToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateToken, isAdmin, categoryController.deleteCategory);

export default router;
