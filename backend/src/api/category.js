import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, isAdmin } from './auth.js'; // Import middleware from the same file or copy it

const prisma = new PrismaClient();
const router = express.Router();

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
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

router.post('/', authenticateToken, isAdmin, async (req, res) => {
    const category = req.body;
    try {
        const result = await createCategory(category);
        res.status(201).json(result);
    } catch (error) {
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
        res.status(500).json({ error: 'Failed to update category' });
    }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await deleteCategory(id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

export default router;
