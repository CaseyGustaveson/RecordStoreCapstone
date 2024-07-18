import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/authController.js'; // Adjust the path as per your project structure

// Middleware to parse JSON bodies
router.use(express.json());

// Routes
router.post('/register', register);
router.post('/login', login);

export default router;