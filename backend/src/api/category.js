import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
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
router.get('/categories', async (req, res) => {
    const categories = await getCategories();
    res.json(categories);
});

router.get('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const category = await getCategory(id);
    res.json(category);
});

router.post('/categories', authenticateToken, isAdmin, async (req, res) => {
    const category = req.body;
    const result = await createCategory(category);
    res.json(result);
});

router.put('/categories/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } =
