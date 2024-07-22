import express from 'express';
<<<<<<< HEAD
const router = express.Router();
import { register, login, logout } from '../controllers/authController.js'; 
=======
import { register, login, logout } from '../controllers/authController.js';

const router = express.Router();
>>>>>>> b74b19b (do-over)

// Middleware to parse JSON bodies
router.use(express.json());

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> b74b19b (do-over)
