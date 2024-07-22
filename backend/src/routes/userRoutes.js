import express from 'express';
<<<<<<< HEAD
const router = express.Router();
import userController from '../controllers/userController.js'; // Ensure this import is correct
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js'; // Ensure middleware imports are correct

=======
import * as userController from '../controllers/userController.js'; // Importing all functions from userController
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js'; // Ensure middleware imports are correct

const router = express.Router();

>>>>>>> b74b19b (do-over)
// Middleware to parse JSON bodies
router.use(express.json());

// Routes
<<<<<<< HEAD
router.get('/', authenticateToken, isAdmin, userController.getUsers);
router.get('/:id', authenticateToken, isAdmin, userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', authenticateToken, isAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser);
=======
router.get('/', authenticateToken, isAdmin, userController.getUsers); // Ensure getUsers function exists in userController
router.get('/:id', authenticateToken, isAdmin, userController.getUserById); // Ensure getUserById function exists in userController
router.post('/', authenticateToken, isAdmin, userController.createUser); // Ensure createUser function exists in userController
router.put('/:id', authenticateToken, isAdmin, userController.updateUser); // Ensure updateUser function exists in userController
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser); // Ensure deleteUser function exists in userController
>>>>>>> b74b19b (do-over)

export default router;
