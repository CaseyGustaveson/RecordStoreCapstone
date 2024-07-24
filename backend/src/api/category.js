import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

// Middleware for Authentication
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) return res.sendStatus(403);

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.sendStatus(403);
    }
};

// Middleware to check if the user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.sendStatus(403);
    }
};

// API Functions for Category Operations
const getCategories = async () => {
    return await prisma.category.findMany();
};

const getCategory = async (categoryId) => {
    return await prisma.category.findUnique({
        where: { id: Number(categoryId) }
    });
};

const createCategory = async (category) => {
    return await prisma.category.create({ data: category });
};

const updateCategory = async (categoryId, category) => {
    return await prisma.category.update({
        where: { id: Number(categoryId) },
        data: category
    });
};

const deleteCategory = async (categoryId) => {
    return await prisma.category.delete({
        where: { id: Number(categoryId) }
    });
};

// Routes for Category Operations
router.get('/', async (req, res) => {
    try {
        const categories = await getCategories();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const category = await getCategory(id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

router.post('/', authenticateToken, isAdmin, async (req, res) => {
    const category = req.body;

    try {
        const result = await createCategory(category);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const category = req.body;
    
    try {
        const result = await updateCategory(id, category);
        res.json(result);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    
    try {
        await deleteCategory(id);
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// Export the router
export default router;
