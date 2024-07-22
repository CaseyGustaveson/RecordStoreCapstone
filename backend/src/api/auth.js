// auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
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
        // Fetch the user from the database to ensure they exist and get their role
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

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.sendStatus(403);
    }
};

// Controller functions for authentication
const register = async (req, res) => {
    const { firstname, lastname, email, phone, password, role } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                phone,
                password: hashedPassword,
                role: role || 'USER',
            },
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({ token });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};

// Controller functions for user management
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

const createUser = async (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                phone,
                password: hashedPassword,
            },
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, phone, password } = req.body;

    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                firstname,
                lastname,
                email,
                phone,
                ...(hashedPassword && { password: hashedPassword }),
            },
        });
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user.delete({
            where: { id: Number(id) },
        });
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// Define routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/user', authenticateToken, isAdmin, getUsers);
router.get('/user/:id', authenticateToken, isAdmin, getUserById);
router.post('/user', createUser);
router.put('/user/:id', authenticateToken, isAdmin, updateUser);
router.delete('/user/:id', authenticateToken, isAdmin, deleteUser);

export { router as authRouter };
