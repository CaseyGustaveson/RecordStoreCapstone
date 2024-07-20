import { PrismaClient } from '@prisma/client';
import exp from 'constants';
const prisma = new PrismaClient();

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
        });
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
        } else {
            res.status(200).json(category);
        }
    } catch (error) {
        console.error('Error getting category by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await prisma.category.create({
            data: { name },
        });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: { name },
        });
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({ where: { id: parseInt(id) } });
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory }