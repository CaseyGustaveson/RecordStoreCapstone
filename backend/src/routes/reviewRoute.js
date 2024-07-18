import express from 'express';
const router = express.Router();
import reviewController from '../controllers/reviewController.js';

// Middleware to parse JSON bodies
router.use(express.json());

// Routes
router.get('/', reviewController.getReviews);
router.get('/:id', reviewController.getReviewById);
router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

export default router;