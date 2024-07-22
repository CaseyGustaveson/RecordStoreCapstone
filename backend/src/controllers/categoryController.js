import { PrismaClient } from '@prisma/client';
<<<<<<< HEAD
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
=======

const prisma = new PrismaClient();

// Fetch all categories
export const getCategories = async () => {
    try {
        const categories = await prisma.category.findMany();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return null;
    }
};

// Fetch a single category by ID
export const getCategory = async (categoryId) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id: Number(categoryId) }
        });
        return category;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
>>>>>>> b74b19b (do-over)
    }
};

// Create a new category
<<<<<<< HEAD
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
=======
export const createCategory = async (category) => {
    try {
        const newCategory = await prisma.category.create({
            data: category
        });
        return newCategory;
    } catch (error) {
        console.error('Error creating category:', error);
        return null;
    }
};

// Update an existing category
export const updateCategory = async (categoryId, category) => {
    try {
        const updatedCategory = await prisma.category.update({
            where: { id: Number(categoryId) },
            data: category
        });
        return updatedCategory;
    } catch (error) {
        console.error('Error updating category:', error);
        return null;
>>>>>>> b74b19b (do-over)
    }
};

// Delete a category
<<<<<<< HEAD
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
=======
export const deleteCategory = async (categoryId) => {
    try {
        await prisma.category.delete({
            where: { id: Number(categoryId) }
        });
        return { message: 'Category deleted successfully' };
    } catch (error) {
        console.error('Error deleting category:', error);
        return null;
    }
};
>>>>>>> b74b19b (do-over)
