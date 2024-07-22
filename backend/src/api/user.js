import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Middleware for Authentication
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

// Controller functions
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.sendStatus(500);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id, 10) }
        });
        if (!user) return res.sendStatus(404);
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.sendStatus(500);
    }
};

const createUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await prisma.user.create({
            data: { email, password, role }
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.sendStatus(500);
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, role } = req.body;
        const user = await prisma.user.update({
            where: { id: parseInt(id, 10) },
            data: { email, password, role }
        });
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.sendStatus(500);
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id: parseInt(id, 10) }
        });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.sendStatus(500);
    }
};

// Routes
router.get('/', authenticateToken, isAdmin, getUsers);
router.get('/:id', authenticateToken, isAdmin, getUserById);
router.post('/', authenticateToken, isAdmin, createUser);
router.put('/:id', authenticateToken, isAdmin, updateUser);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

export default router;
