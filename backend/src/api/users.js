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
    const {  email,password,firstname,lastname,phone,address,  } = req.body;
    try {
        if (!firstname ||!lastname || !email || !password|| !phone|| !address) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        const newUser = await prisma.user.create({
            data: { firstname,lastname, email, password, phone, address }
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
}

const editUser = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, password, phone, address } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { email, password ,firstname, lastname, phone, address }
        });
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
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
router.put('/:id', editUser);
router.post('/', createUser);
router.delete('/:id', deleteUsers);


export default router;