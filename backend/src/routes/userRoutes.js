import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js'; // Ensure this import is correct
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js'; // Ensure middleware imports are correct

// Middleware to parse JSON bodies
router.use(express.json());

// Routes
router.get('/', authenticateToken, isAdmin, userController.getUsers);
router.get('/:id', authenticateToken, isAdmin, userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', authenticateToken, isAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser);

export default router;
