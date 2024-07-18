import express from 'express';
const router = express.Router();
import profileController from '../controllers/profileController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';


// Middleware to parse JSON bodies
router.use(express.json());

// Routes
router.get('/', authenticateToken, isAdmin, profileController.getProfiles);
router.get('/:id', authenticateToken, isAdmin, profileController.getProfileById);
router.post('/', authenticateToken, isAdmin, profileController.createProfile);
router.put('/:id', authenticateToken, isAdmin, profileController.updateProfile);
router.delete('/:id', authenticateToken, isAdmin, profileController.deleteProfile);

export default router;
