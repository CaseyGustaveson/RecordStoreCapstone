import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Middleware to parse JSON request body
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

// Admin Middleware
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.sendStatus(403);
    }
};

// Controller functions
const searchProducts = async (query) => {
    try {
        return await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            }
        });
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

const searchProductsByCategory = async (query, categoryId) => {
    try {
        return await prisma.product.findMany({
            where: {
                AND: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { categoryId: Number(categoryId) }
                ]
            }
        });
    } catch (error) {
        console.error('Error searching products by category:', error);
        throw error;
    }
};

const getProducts = async () => {
    try {
        return await prisma.product.findMany();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

const getProduct = async (productId) => {
    try {
        return await prisma.product.findUnique({
            where: { id: Number(productId) }
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

// Routes
router.get('/search', async (req, res) => {
    const query = req.query.query;
    try {
        const data = await searchProducts(query);
        res.json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get('/search/category', async (req, res) => {
    const query = req.query.query;
    const categoryId = req.query.categoryId;
    try {
        const data = await searchProductsByCategory(query, categoryId);
        res.json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get('/products', async (req, res) => {
    try {
        const data = await getProducts();
        res.json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const data = await getProduct(productId);
        if (!data) return res.sendStatus(404);
        res.json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

// Protected Routes
router.post('/products', authenticateToken, isAdmin, async (req, res) => {
    const { name, description, price, categoryId } = req.body;
    try {
        const newProduct = await prisma.product.create({
            data: { name, description, price, categoryId: Number(categoryId) }
        });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.sendStatus(500);
    }
});

router.put('/products/:id', authenticateToken, isAdmin, async (req, res) => {
    const productId = req.params.id;
    const { name, description, price, categoryId } = req.body;
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: Number(productId) },
            data: { name, description, price, categoryId: Number(categoryId) }
        });
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.sendStatus(500);
    }
});

router.delete('/products/:id', authenticateToken, isAdmin, async (req, res) => {
    const productId = req.params.id;
    try {
        await prisma.product.delete({
            where: { id: Number(productId) }
        });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.sendStatus(500);
    }
});

export default router;
