import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
import { authenticateToken,isAdmin } from '../middleware/authMiddleware.js';
// Middleware to parse JSON bodies
router.use(express.json());
//routes
router.get('/',authenticateToken,isAdmin, userController.getUsers);
router.get('/:id',authenticateToken,isAdmin, userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id',authenticateToken,isAdmin, userController.updateUser);
router.delete('/:id',authenticateToken,isAdmin, userController.deleteUser);

export default router