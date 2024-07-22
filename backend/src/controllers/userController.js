import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'An error occurred while fetching the user.' });
    }
};

// Create a new user
export const createUser = async (req, res) => {
    const { name, email, password } = req.body; // Adjust based on your User model
    try {
        const newUser = await prisma.user.create({
            data: { name, email, password } // Adjust based on your User model
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
};

// Update user by ID
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body; // Adjust based on your User model
    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { name, email, password } // Adjust based on your User model
        });
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: Number(id) } });
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
};
