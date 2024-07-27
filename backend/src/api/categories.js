import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';  
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

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
}

const getCatgeories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.sendStatus(500);
    }
}

const addCategory = async (req, res) => {
    const { name } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const newCategory = await prisma.category.create({
            data: { name }
        });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.category.delete({
            where: { id: Number(id) }
        });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
}

router.get('/', getCatgeories);
router.post('/', authenticateToken, addCategory);
router.delete('/:id', authenticateToken, deleteCategory);

export default router;