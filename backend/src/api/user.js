import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { authenticateToken } from './auth.js'; // Ensure correct import path

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

// Controller functions
const getUserProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Error fetching user profile' });
    }
};

// Define routes directly in the file
router.get('/profile', authenticateToken, getUserProfile);

export default router;
