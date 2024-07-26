import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const router = express.Router();

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
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
}

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Ensure required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        const newUser = await prisma.user.create({
            data: { name, email, password }
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
}

const deleteUsers = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.delete('/:id', deleteUsers);

export default router;