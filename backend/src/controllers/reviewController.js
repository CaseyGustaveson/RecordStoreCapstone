import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();





const getReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany();
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error getting reviews:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await prisma.review.findUnique({
            where: { id: parseInt(id) },
        });
        if (!review) {
            res.status(404).json({ error: 'Review not found' });
        } else {
            res.status(200).json(review);
        }
    } catch (error) {
        console.error('Error getting review by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        const newReview = await prisma.review.create({
            data: { rating, comment, productId },
        });
        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment, productId } = req.body;
        const updatedReview = await prisma.review.update({
            where: { id: parseInt(id) },
            data: { rating, comment, productId },
        });
        res.status(200).json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteReview = async (req, res) => {  
    try {
        const { id } = req.params;
        await prisma.review.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default { getReviews, getReviewById, createReview, updateReview, deleteReview };