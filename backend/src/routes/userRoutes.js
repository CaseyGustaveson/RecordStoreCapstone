import express from 'express';
import * as userController from '../controllers/userController.js'; // Importing all functions from userController
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js'; // Ensure middleware imports are correct

const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Routes
router.get('/', authenticateToken, isAdmin, userController.getUsers); // Ensure getUsers function exists in userController
router.get('/:id', authenticateToken, isAdmin, userController.getUserById); // Ensure getUserById function exists in userController
router.post('/', authenticateToken, isAdmin, userController.createUser); // Ensure createUser function exists in userController
router.put('/:id', authenticateToken, isAdmin, userController.updateUser); // Ensure updateUser function exists in userController
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser); // Ensure deleteUser function exists in userController

export default router;
